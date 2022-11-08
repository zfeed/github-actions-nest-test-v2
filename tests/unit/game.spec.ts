import * as dayjs from 'dayjs';

import Match from '../../src/game/components/match/core/domain/Match';
import Player from '../../src/game/components/match/core/domain/Player';
import MatchStartedEvent from '../../src/game/components/match/core/domain/events/MatchStartedEvent';
import MatchFinishedEvent from '../../src/game/components/match/core/domain/events/MatchFinishedEvent';
import Session from '../../src/game/shared/Session';
import { MINUTES_TO_PLAY } from '../../src/game/shared/constants';

describe('Match', () => {
    test('Match is created', () => {
        const match = Match.create('1', Player.create('1', 'playerName'), 2);

        expect(match.getSession()).toBe(undefined);
        expect(match.getPlayers()).toEqual([Player.create('1', 'playerName')]);
        expect(match.id).toBe('1');
        expect(match.getMaxPlayers()).toBe(2);
    });

    test('Player joined a match the second time', () => {
        const match = Match.create('1', Player.create('1', 'Mike'), 2);

        expect(() =>
            match.join(Player.create('1', 'Mike'), new Date())
        ).toThrow();
    });

    test('All players joined', () => {
        const now = new Date();
        const match = Match.create('match123', Player.create('1', 'John'), 2);

        match.join(Player.create('2', 'Mike'), now);

        expect(match.getSession()).toEqual(Session.create(1, now));
        expect(match.getPlayers()).toEqual([
            Player.create('1', 'John'),
            Player.create('2', 'Mike')
        ]);
        expect(match.events).toEqual([
            new MatchStartedEvent(1, now, 'match123', ['1', '2'])
        ]);
    });

    test('Max number of players reached', () => {
        const now = new Date();
        const match = Match.create('match123', Player.create('1', 'John'), 2);

        match.join(Player.create('2', 'Mike'), now);

        expect(() => match.join(Player.create('3', 'Jeff'), now)).toThrow();
    });

    test('Player score is increased by 1', () => {
        const match = Match.create('match123', Player.create('1', 'John'), 2);
        match.join(Player.create('2', 'Mike'), new Date());

        match.increasePlayerScore('1', new Date());

        const player = match
            .getPlayers()
            .find(({ id }) => id === '1') as Player;
        expect(player.getScore()).toBe(1);
    });

    test('Player score is not increased when match is finished', () => {
        const match = Match.create('1', Player.create('1', 'John'), 2);
        match.join(Player.create('2', 'Mike'), new Date());

        expect(() =>
            match.increasePlayerScore('1', dayjs().add(11, 'minute').toDate())
        ).toThrow();
    });

    test('Player score is not increased when match is not started yet', () => {
        const match = Match.create('1', Player.create('1', 'John'), 2);

        expect(() => match.increasePlayerScore('1', new Date())).toThrow();
    });

    test('Player score is not increased when player has not joined', () => {
        const match = Match.create('1', Player.create('1', 'John'), 2);
        match.join(Player.create('2', 'Mike'), new Date());

        expect(() => match.increasePlayerScore('3', new Date())).toThrow();
    });

    test('Player can not joined when match is already started', () => {
        const match = Match.create('1', Player.create('1', 'John'), 2);

        match.join(Player.create('2', 'Mike'), new Date());

        expect(() =>
            match.join(Player.create('3', 'Mike'), new Date())
        ).toThrow();
    });

    test("Match can't be finished if it's not started yet", () => {
        const match = Match.create('1', Player.create('1', 'John'), 2);

        expect(match.getSession()).toBe(undefined);
        expect(() => match.finish(new Date())).toThrow();
    });

    test("Match can't be finished if it's started but not over yet", () => {
        const match = Match.create('1', Player.create('1', 'John'), 2);

        match.join(Player.create('2', 'Mike'), new Date());

        expect(match.getSession()).toBeTruthy();
        expect(match.getSession()!.isOver(new Date())).toBeFalse();
        expect(() => match.finish(new Date())).toThrow();
    });

    test('Match can be finished only one time', async () => {
        const match = Match.create('1', Player.create('1', 'John'), 2);
        const past = dayjs().subtract(MINUTES_TO_PLAY, 'minutes').toDate();

        match.join(Player.create('2', 'Mike'), past);
        match.finish(new Date());

        expect(() => match.finish(new Date())).toThrow();
    });

    test('Match finishes correctly', async () => {
        const match = Match.create('1', Player.create('1', 'John'), 2);
        const past = dayjs().subtract(MINUTES_TO_PLAY, 'minutes').toDate();
        const now = new Date();

        match.join(Player.create('2', 'Mike'), past);
        match.finish(now);

        expect(match.getFinishedAt()).toBe(now);
        expect(match.isFinished()).toBeTrue();
        expect(match.events).toEqual([
            new MatchStartedEvent(MINUTES_TO_PLAY, past, '1', ['1', '2']),
            new MatchFinishedEvent(
                MINUTES_TO_PLAY,
                past,
                '1',
                [
                    { id: '1', score: 0 },
                    { id: '2', score: 0 }
                ],
                now
            )
        ]);
    });
});

import { Module } from '@nestjs/common';
import GameModule from './game/Module';
import BettingModule from './betting/Module';

@Module({
    imports: [GameModule, BettingModule]
})
export default class AppModule {}

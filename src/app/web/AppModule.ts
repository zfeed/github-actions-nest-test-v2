import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Module } from '@nestjs/common';

import EventsController from './controllers/Events/Controller';
import GameController from './controllers/Game/Controller';
import FieldController from './controllers/Field/Controller';
import GameService from '../../core/services/GameService/GameService';
import FieldService from '../../core/services/FieldService/FieldService';

import FieldMarkedCellPositionChangedListner from './listeners/FieldMarkedCellPositionChangedListner';
import GameStartedEventListner from './listeners/GameStartedEventListner';
import MarkedCellHitEventListner from './listeners/MarkedCellHitEventListner';

import ServerSentEvents from './ServerSentEvents/ServerSentEvents';

@Module({
    imports: [MikroOrmModule.forRoot(), EventEmitterModule.forRoot()],
    controllers: [GameController, FieldController, EventsController],
    providers: [
        GameService,
        FieldService,
        FieldMarkedCellPositionChangedListner,
        GameStartedEventListner,
        MarkedCellHitEventListner,
        ServerSentEvents
    ]
})
export default class AppModule {}

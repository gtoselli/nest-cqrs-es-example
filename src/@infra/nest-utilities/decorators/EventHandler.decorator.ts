import { applyDecorators, SetMetadata } from '@nestjs/common';
import { Event } from '../../event';
import { ClassNotInstanceOf } from '../../utils';

export const GleEventHandlerMetadataKey = 'isGleEventHandler';
export const GleEventNameMetadataKey = 'GleEventHandlerForEvent';

export const EventHandler = (...event: ClassNotInstanceOf<Event<unknown>>[]) =>
    applyDecorators(SetMetadata(GleEventHandlerMetadataKey, true), SetMetadata(GleEventNameMetadataKey, event[0].name));

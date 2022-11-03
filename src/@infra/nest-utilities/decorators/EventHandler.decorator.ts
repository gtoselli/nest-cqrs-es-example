import { SetMetadata } from '@nestjs/common';

export const GleEventHandlerMetadataKey = 'isGleEventHandler';
export const EventHandler = () => SetMetadata(GleEventHandlerMetadataKey, true);

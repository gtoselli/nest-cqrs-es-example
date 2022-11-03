import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddItemDto {
    @IsNotEmpty()
    @IsUUID()
    cartId: string;

    @IsNotEmpty()
    @IsUUID()
    itemId: string;

    @IsNotEmpty()
    @IsString()
    itemName: string;
}

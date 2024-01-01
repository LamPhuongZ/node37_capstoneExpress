import { ApiProperty } from "@nestjs/swagger";

export class createImageDto {
    @ApiProperty({ description: "image_name", type: String })
    image_name: string;

    @ApiProperty({ description: "description", type: String })
    description: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    url: any;
}
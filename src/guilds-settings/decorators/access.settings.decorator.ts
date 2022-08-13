import {applyDecorators, SetMetadata} from '@nestjs/common';
import {IGuildAccessCheckSettings} from "../../reports/dto/guild.access.check.settings";

export const AccessSettings = (settings:IGuildAccessCheckSettings) => {
	return applyDecorators(
		SetMetadata('checkAccessSettings', settings),
	);
}
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import "dotenv/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({origin:"http://localhost:3000", credentials:true});
  const port = Number(process.env.SERVER_PORT || 5000);
  await app.listen(port, () => console.log("Server successfully started on port " + port));
}
bootstrap();

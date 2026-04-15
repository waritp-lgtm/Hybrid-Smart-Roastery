import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API versioning
  app.enableVersioning({ type: VersioningType.URI });

  // CORS
  app.enableCors({
    origin: config.get('CORS_ORIGINS', 'http://localhost:3000').split(','),
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger Documentation
  if (config.get('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Eight Coffee Roasters API')
      .setDescription('Hybrid Smart Roastery — ERP + E-Commerce API')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Auth', 'Authentication & Authorization')
      .addTag('Users', 'User management (RBAC)')
      .addTag('Products', 'Coffee products catalog')
      .addTag('Inventory', 'Green & Roasted bean inventory')
      .addTag('Roast Jobs', 'Roasting job orders')
      .addTag('Orders', 'Order management (State Machine)')
      .addTag('Payments', 'Payment processing (GB Prime Pay)')
      .addTag('Logistics', 'Flash Express shipping')
      .addTag('Notifications', 'LINE Messaging API')
      .addTag('IoT', 'Sensor readings & devices (Phase 2)')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
    console.log(`📖 Swagger docs available at: http://localhost:${config.get('PORT', 4000)}/docs`);
  }

  const port = config.get<number>('PORT', 4000);
  await app.listen(port);
  console.log(`🚀 Eight Coffee Roasters API running on port ${port}`);
}

bootstrap();

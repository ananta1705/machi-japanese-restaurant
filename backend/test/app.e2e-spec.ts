import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('Machi Menus API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /menus mengembalikan data awal menu Machi', async () => {
    const res = await request(app.getHttpServer()).get('/menus').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(4);
    expect(res.body[0]).toHaveProperty('name', 'Signature Tonkotsu Ramen');
  });

  it('GET /menus/:id mengembalikan detail menu dan 404 jika tidak ada', async () => {
    const res = await request(app.getHttpServer()).get('/menus/1').expect(200);
    expect(res.body.id).toBe(1);

    await request(app.getHttpServer()).get('/menus/999').expect(404);
  });

  it('POST /menus membuat menu baru, menolak duplikat (409), dan menolak DTO tidak valid (400)', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/menus')
      .send({
        name: 'Black Garlic Miso Ramen',
        description: 'Paduan tiga miso Hokkaido dengan minyak bawang putih hitam aromatik.',
        price: 64000,
        category: 'Ramen',
      })
      .expect(201);

    expect(createRes.body.id).toBe(5);
    expect(createRes.body.isAvailable).toBe(true);

    // Duplikat nama -> 409 ConflictException
    await request(app.getHttpServer())
      .post('/menus')
      .send({
        name: 'black garlic miso ramen',
        description: 'Deskripsi valid minimal sepuluh karakter.',
        price: 64000,
        category: 'Ramen',
      })
      .expect(409);

    // Input DTO tidak valid (harga < 1000, kategori tidak valid, field asing) -> 400
    await request(app.getHttpServer())
      .post('/menus')
      .send({
        name: 'AB',
        description: 'Pendek',
        price: 500,
        category: 'Pizza',
        extraField: 'should be rejected',
      })
      .expect(400);
  });

  it('PATCH /menus/:id memperbarui sebagian field, menolak duplikat (409), dan 404 jika ID tidak ada', async () => {
    const patchRes = await request(app.getHttpServer())
      .patch('/menus/1')
      .send({ price: 60000, isAvailable: false })
      .expect(200);

    expect(patchRes.body.price).toBe(60000);
    expect(patchRes.body.isAvailable).toBe(false);

    // Duplikat nama dengan menu lain -> 409
    await request(app.getHttpServer())
      .patch('/menus/1')
      .send({ name: 'Spicy Tantanmen Tokyo' })
      .expect(409);

    // ID tidak ditemukan -> 404
    await request(app.getHttpServer())
      .patch('/menus/999')
      .send({ price: 50000 })
      .expect(404);
  });

  it('DELETE /menus/:id menghapus menu dan mengembalikan 404 jika ID tidak ditemukan', async () => {
    await request(app.getHttpServer()).delete('/menus/4').expect(200);
    await request(app.getHttpServer()).get('/menus/4').expect(404);
    await request(app.getHttpServer()).delete('/menus/999').expect(404);
  });
});

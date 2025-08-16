import { Handler } from '@netlify/functions';
import { prisma } from './prismaClient';

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    if (event.httpMethod === 'GET') {
      const dependencias = await prisma.dependencia.findMany({
        include: {
          _count: {
            select: { equipos: true, solicitudes: true }
          }
        },
        orderBy: { nombre: 'asc' }
      });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(dependencias)
      };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const created = await prisma.dependencia.create({
        data: {
          nombre: body.nombre,
          descripcion: body.descripcion ?? null,
        }
      });
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(created)
      };
    }

    if (event.httpMethod === 'PUT') {
      const body = JSON.parse(event.body || '{}');
      const { id, ...updateData } = body;
      const updated = await prisma.dependencia.update({
        where: { id: parseInt(id) },
        data: updateData
      });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(updated)
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  } catch (error: any) {
    console.error('Error in dependencias function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

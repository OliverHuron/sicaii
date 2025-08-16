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
      const data = await prisma.categoria.findMany({ 
        orderBy: { id: 'asc' },
        include: {
          _count: {
            select: { equipos: true }
          }
        }
      });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const created = await prisma.categoria.create({
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
      const updated = await prisma.categoria.update({
        where: { id: parseInt(id) },
        data: updateData
      });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(updated)
      };
    }

    if (event.httpMethod === 'DELETE') {
      const pathParams = event.path.split('/');
      const id = pathParams[pathParams.length - 1];
      await prisma.categoria.delete({
        where: { id: parseInt(id) }
      });
      return {
        statusCode: 204,
        headers,
        body: ''
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  } catch (error: any) {
    console.error('Error in categorias function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

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
      const equipos = await prisma.equipo.findMany({
        include: {
          categoria: true,
          dependencia: true
        },
        orderBy: { nombre: 'asc' }
      });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(equipos)
      };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const created = await prisma.equipo.create({
        data: {
          nombre: body.nombre,
          codigo: body.codigo,
          serie: body.serie,
          descripcion: body.descripcion,
          estado: body.estado || 'DISPONIBLE',
          categoria: { connect: { id: body.categoriaId }},
          dependencia: body.dependenciaId ? { connect: { id: body.dependenciaId }} : undefined
        },
        include: {
          categoria: true,
          dependencia: true
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
      const { id, categoriaId, dependenciaId, ...updateData } = body;
      const updated = await prisma.equipo.update({
        where: { id: parseInt(id) },
        data: {
          ...updateData,
          categoria: categoriaId ? { connect: { id: categoriaId }} : undefined,
          dependencia: dependenciaId ? { connect: { id: dependenciaId }} : undefined
        },
        include: {
          categoria: true,
          dependencia: true
        }
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
    console.error('Error in equipos function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

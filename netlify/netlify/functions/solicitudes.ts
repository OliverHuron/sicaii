import { Handler } from '@netlify/functions';
import { prisma } from './prismaClient';

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    if (event.httpMethod === 'GET') {
      const solicitudes = await prisma.solicitud.findMany({
        include: { 
          solicitante: true, 
          aprobador: true, 
          dependencia: true,
          items: { 
            include: { 
              equipo: {
                include: {
                  categoria: true
                }
              } 
            } 
          } 
        },
        orderBy: { createdAt: 'desc' }
      });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(solicitudes)
      };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { solicitanteId, dependenciaId, motivo, items } = body;
      
      const created = await prisma.solicitud.create({
        data: {
          motivo,
          solicitante: { connect: { id: solicitanteId }},
          dependencia: dependenciaId ? { connect: { id: dependenciaId }} : undefined,
          items: {
            create: (items || []).map((item: any) => ({
              equipo: { connect: { id: item.equipoId }},
              cantidad: item.cantidad ?? 1
            }))
          }
        },
        include: { 
          items: { 
            include: { 
              equipo: {
                include: {
                  categoria: true
                }
              } 
            } 
          },
          solicitante: true,
          dependencia: true
        }
      });
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(created)
      };
    }

    if (event.httpMethod === 'PATCH') {
      const body = JSON.parse(event.body || '{}');
      const { id, estado, aprobadorId } = body;
      
      const updated = await prisma.solicitud.update({
        where: { id: parseInt(id) },
        data: {
          estado,
          aprobador: aprobadorId ? { connect: { id: aprobadorId }} : undefined
        },
        include: { 
          items: { 
            include: { 
              equipo: {
                include: {
                  categoria: true
                }
              } 
            } 
          }, 
          solicitante: true, 
          aprobador: true,
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
    console.error('Error in solicitudes function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

/**
 * Netlify Function: Health Check
 *
 * This function provides a simple health check endpoint for monitoring
 * and can be used to verify the deployment is working correctly.
 *
 * URL: /.netlify/functions/health
 */

exports.handler = async (event: any, context: any) => {
  // CORS headers for browser requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    // Check if Strapi is accessible
    const strapiUrl = process.env.PUBLIC_STRAPI_URL
    let strapiStatus = 'unknown'

    if (strapiUrl) {
      try {
        const strapiResponse = await fetch(`${strapiUrl}/api/info-pages?pagination[limit]=1`)
        strapiStatus = strapiResponse.ok ? 'healthy' : 'error'
      } catch (error) {
        strapiStatus = 'unreachable'
      }
    }

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'production',
      services: {
        strapi: {
          status: strapiStatus,
          url: strapiUrl ? strapiUrl.replace(/\/+$/, '') : 'not-configured',
        },
        netlify: {
          status: 'healthy',
          region: process.env.AWS_REGION || 'unknown',
          deployId: context.deployId || 'unknown',
        },
      },
      checks: {
        environmentVariables: {
          strapiUrl: !!process.env.PUBLIC_STRAPI_URL,
          siteUrl: !!process.env.PUBLIC_SITE_URL,
        },
      },
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(healthData, null, 2),
    }
  } catch (error) {
    console.error('Health check error:', error)

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}

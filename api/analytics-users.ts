import type { VercelRequest, VercelResponse } from '@vercel/node';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const propertyId = process.env.GA_PROPERTY_ID;
    const clientEmail = process.env.GA_CLIENT_EMAIL;
    const rawPrivateKey = process.env.GA_PRIVATE_KEY || '';

    const privateKey = rawPrivateKey
      .replace(/^["']|["']$/g, '')
      .replace(/\\n/g, '\n');

    if (!propertyId || !clientEmail || !privateKey) {
      return res.status(500).json({
        error: 'Analytics configuration is missing',
      });
    }

    const analyticsClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });

    const [response] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '2026-05-01',
          endDate: 'today',
        },
      ],
      metrics: [
        {
          name: 'totalUsers',
        },
      ],
    });

    const users = Number(
      response.rows?.[0]?.metricValues?.[0]?.value || 0
    );

    res.setHeader(
      'Cache-Control',
      's-maxage=3600, stale-while-revalidate=86400'
    );

    return res.status(200).json({ users });
  } catch (error: any) {
    console.error('Google Analytics error:', error);

    return res.status(500).json({
      error: 'Unable to retrieve analytics',
      details: error?.message || String(error),
    });
  }
}
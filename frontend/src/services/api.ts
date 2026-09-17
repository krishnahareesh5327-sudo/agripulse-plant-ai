import { AnalysisResponse, QualityReport, ScanRecord, SampleLeaf, SystemInfo } from '../types';

const BASE_URL = '';

export async function checkImageQuality(file: File): Promise<{ success: boolean; report: QualityReport }> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${BASE_URL}/api/image-quality`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to evaluate image quality');
  }
  return res.json();
}

export async function analyzePlant(formData: FormData): Promise<AnalysisResponse> {
  const res = await fetch(`${BASE_URL}/api/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to complete plant analysis');
  }
  return res.json();
}

export async function getScans(
  filter: string = 'all',
  search: string = '',
  limit: number = 50,
  offset: number = 0
): Promise<{
  scans: ScanRecord[];
  total: number;
  stats: {
    total_scans: number;
    healthy_scans: number;
    diseased_scans: number;
    avg_health_score: number;
  };
}> {
  const params = new URLSearchParams({
    filter,
    search,
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const res = await fetch(`${BASE_URL}/api/scans?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to load scan records');
  }
  return res.json();
}

export async function getScanDetails(scanId: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/scans/${scanId}`);
  if (!res.ok) {
    throw new Error('Failed to load scan details');
  }
  return res.json();
}

export async function deleteScan(scanId: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/api/scans/${scanId}`, {
    method: 'DELETE',
  });
  return res.ok;
}

export async function clearAllScans(): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/api/scans`, {
    method: 'DELETE',
  });
  return res.ok;
}

export async function getEnvironmentalOverview(crop: string = 'Tomato'): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/environmental/overview?crop=${encodeURIComponent(crop)}`);
  if (!res.ok) {
    throw new Error('Failed to load environmental overview');
  }
  return res.json();
}

export async function postSensorData(payload: any): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/sensor-data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function getCropEncyclopedia(): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/crops`);
  if (!res.ok) {
    throw new Error('Failed to load crop encyclopedia');
  }
  return res.json();
}

export async function getSystemInfo(): Promise<SystemInfo> {
  const res = await fetch(`${BASE_URL}/api/system/info`);
  if (!res.ok) {
    throw new Error('Failed to load system info');
  }
  return res.json();
}

export async function getSampleLeaves(): Promise<SampleLeaf[]> {
  const res = await fetch(`${BASE_URL}/api/samples`);
  if (!res.ok) {
    throw new Error('Failed to load sample leaves');
  }
  return res.json();
}

"""
AgriPulse AI - SQLite Database Manager
Provides lightweight persistence for scans, sensor logs, and system configuration.
"""
import sqlite3
import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple

DB_PATH = Path(__file__).resolve().parent / "data" / "scans.db"

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS scans (
                id TEXT PRIMARY KEY,
                created_at TEXT NOT NULL,
                crop TEXT NOT NULL,
                condition TEXT NOT NULL,
                scientific_name TEXT,
                pathogen_type TEXT,
                is_healthy INTEGER NOT NULL,
                confidence REAL NOT NULL,
                confidence_level TEXT NOT NULL,
                health_score INTEGER NOT NULL,
                severity TEXT NOT NULL,
                risk_level TEXT NOT NULL,
                image_url TEXT NOT NULL,
                thumbnail_url TEXT,
                sensor_data TEXT,
                prediction_data TEXT,
                evaluated_sensors TEXT,
                compound_risk TEXT,
                recommendations TEXT,
                technical_data TEXT,
                notes TEXT
            );
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS environmental_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                soil_moisture REAL,
                temperature REAL,
                humidity REAL,
                ph REAL,
                light REAL,
                rainfall REAL,
                source TEXT DEFAULT 'Manual'
            );
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );
        """)
        conn.commit()

def save_scan(data: Dict[str, Any]) -> str:
    scan_id = data.get("id") or str(uuid.uuid4())
    created_at = data.get("created_at") or datetime.utcnow().isoformat()
    
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO scans (
                id, created_at, crop, condition, scientific_name, pathogen_type,
                is_healthy, confidence, confidence_level, health_score, severity,
                risk_level, image_url, thumbnail_url, sensor_data, prediction_data,
                evaluated_sensors, compound_risk, recommendations, technical_data, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            scan_id,
            created_at,
            data.get("crop", "Unknown"),
            data.get("condition", "Unknown"),
            data.get("scientific_name", ""),
            data.get("pathogen_type", ""),
            1 if data.get("is_healthy", False) else 0,
            float(data.get("confidence", 0.0)),
            data.get("confidence_level", "Moderate"),
            int(data.get("health_score", 70)),
            data.get("severity", "Moderate"),
            data.get("risk_level", "Moderate"),
            data.get("image_url", ""),
            data.get("thumbnail_url", ""),
            json.dumps(data.get("sensor_data", {})),
            json.dumps(data.get("prediction_data", {})),
            json.dumps(data.get("evaluated_sensors", {})),
            json.dumps(data.get("compound_risk", {})),
            json.dumps(data.get("recommendations", {})),
            json.dumps(data.get("technical", {})),
            data.get("notes", "")
        ))
        conn.commit()
    return scan_id

def get_scans(
    filter_type: str = "all",
    search: str = "",
    limit: int = 50,
    offset: int = 0
) -> Tuple[List[Dict[str, Any]], int, Dict[str, Any]]:
    query = "SELECT * FROM scans WHERE 1=1"
    params: List[Any] = []

    if filter_type == "healthy":
        query += " AND is_healthy = 1"
    elif filter_type == "diseased":
        query += " AND is_healthy = 0"
    elif filter_type == "high_risk":
        query += " AND (risk_level LIKE '%High%' OR risk_level LIKE '%Critical%')"
    elif filter_type == "low_confidence":
        query += " AND confidence_level = 'Low'"

    if search:
        query += " AND (crop LIKE ? OR condition LIKE ? OR notes LIKE ?)"
        like_val = f"%{search}%"
        params.extend([like_val, like_val, like_val])

    # Count query
    count_query = f"SELECT COUNT(*) as total FROM ({query})"
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(count_query, params)
        total = cursor.fetchone()["total"]

        # Statistics summary
        cursor.execute("""
            SELECT 
                COUNT(*) as total_scans,
                SUM(CASE WHEN is_healthy = 1 THEN 1 ELSE 0 END) as healthy_scans,
                SUM(CASE WHEN is_healthy = 0 THEN 1 ELSE 0 END) as diseased_scans,
                AVG(health_score) as avg_health_score
            FROM scans
        """)
        stats_row = cursor.fetchone()
        stats = {
            "total_scans": stats_row["total_scans"] or 0,
            "healthy_scans": stats_row["healthy_scans"] or 0,
            "diseased_scans": stats_row["diseased_scans"] or 0,
            "avg_health_score": round(stats_row["avg_health_score"] or 0, 1)
        }

        # Data query with pagination
        query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])
        cursor.execute(query, params)
        rows = cursor.fetchall()

    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "created_at": r["created_at"],
            "crop": r["crop"],
            "condition": r["condition"],
            "scientific_name": r["scientific_name"],
            "pathogen_type": r["pathogen_type"],
            "is_healthy": bool(r["is_healthy"]),
            "confidence": r["confidence"],
            "confidence_level": r["confidence_level"],
            "health_score": r["health_score"],
            "severity": r["severity"],
            "risk_level": r["risk_level"],
            "image_url": r["image_url"],
            "thumbnail_url": r["thumbnail_url"],
            "sensor_data": json.loads(r["sensor_data"]) if r["sensor_data"] else {},
            "compound_risk": json.loads(r["compound_risk"]) if r["compound_risk"] else {},
            "notes": r["notes"]
        })

    return results, total, stats

def get_scan(scan_id: str) -> Optional[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM scans WHERE id = ?", (scan_id,))
        row = cursor.fetchone()
        if not row:
            return None
        return {
            "id": row["id"],
            "created_at": row["created_at"],
            "crop": row["crop"],
            "condition": row["condition"],
            "scientific_name": row["scientific_name"],
            "pathogen_type": row["pathogen_type"],
            "is_healthy": bool(row["is_healthy"]),
            "confidence": row["confidence"],
            "confidence_level": row["confidence_level"],
            "health_score": row["health_score"],
            "severity": row["severity"],
            "risk_level": row["risk_level"],
            "image_url": row["image_url"],
            "thumbnail_url": row["thumbnail_url"],
            "sensor_data": json.loads(row["sensor_data"]) if row["sensor_data"] else {},
            "prediction_data": json.loads(row["prediction_data"]) if row["prediction_data"] else {},
            "evaluated_sensors": json.loads(row["evaluated_sensors"]) if row["evaluated_sensors"] else {},
            "compound_risk": json.loads(row["compound_risk"]) if row["compound_risk"] else {},
            "recommendations": json.loads(row["recommendations"]) if row["recommendations"] else {},
            "technical": json.loads(row["technical_data"]) if row["technical_data"] else {},
            "notes": row["notes"]
        }

def delete_scan(scan_id: str) -> bool:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM scans WHERE id = ?", (scan_id,))
        conn.commit()
        return cursor.rowcount > 0

def clear_all_scans():
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM scans")
        conn.commit()

def log_sensor_reading(data: Dict[str, Any]) -> int:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO environmental_logs (
                timestamp, soil_moisture, temperature, humidity, ph, light, rainfall, source
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data.get("timestamp") or datetime.utcnow().isoformat(),
            data.get("soil_moisture"),
            data.get("temperature"),
            data.get("humidity"),
            data.get("ph"),
            data.get("light"),
            data.get("rainfall"),
            data.get("source", "Manual")
        ))
        conn.commit()
        return cursor.lastrowid

def get_sensor_history(limit: int = 24) -> List[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM environmental_logs ORDER BY timestamp DESC LIMIT ?", (limit,))
        rows = cursor.fetchall()
        return [dict(r) for r in reversed(rows)]

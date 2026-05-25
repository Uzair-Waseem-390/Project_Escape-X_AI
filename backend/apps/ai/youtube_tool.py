from googleapiclient.discovery import build
from django.conf import settings


def search_youtube(query: str, max_results: int = 1) -> list[dict]:
    """
    Searches YouTube Data API v3 and returns a list of video dicts.
    Each dict has: { "title": str, "url": str, "video_id": str }

    Returns an empty list on any failure so the agent degrades gracefully.
    """
    try:
        youtube = build("youtube", "v3", developerKey=settings.YOUTUBE_API_KEY)
        response = (
            youtube.search()
            .list(
                q=query,
                part="snippet",
                type="video",
                maxResults=max_results,
                relevanceLanguage="en",
                safeSearch="moderate",
            )
            .execute()
        )
        results = []
        for item in response.get("items", []):
            video_id = item["id"]["videoId"]
            results.append({
                "title": item["snippet"]["title"],
                "url": f"https://www.youtube.com/watch?v={video_id}",
                "video_id": video_id,
            })
        return results
    except Exception:
        return []

from django.db import models

# ── Subjects ─────────────────────────────────────────────────────────────────
class Subject(models.TextChoices):
    MATH = "math", "Mathematics"
    COMPUTER = "computer", "Computer Science"
    PHYSICS = "physics", "Physics"
    CHEMISTRY = "chemistry", "Chemistry"
    GK = "gk", "General Knowledge"


# Subject display order (used for question flow)
SUBJECT_ORDER = [
    Subject.MATH,
    Subject.COMPUTER,
    Subject.PHYSICS,
    Subject.CHEMISTRY,
    Subject.GK,
]

# ── Difficulty ────────────────────────────────────────────────────────────────
class Difficulty(models.TextChoices):
    EASY = "easy", "Easy"
    MEDIUM = "medium", "Medium"
    HARD = "hard", "Hard"


# Level → difficulty mapping
LEVEL_DIFFICULTY: dict[int, str] = {
    1: Difficulty.EASY,
    2: Difficulty.EASY,
    3: Difficulty.MEDIUM,
    4: Difficulty.MEDIUM,
    5: Difficulty.HARD,
}

# ── Game rules ────────────────────────────────────────────────────────────────
TOTAL_LEVELS = 5
QUESTIONS_PER_SUBJECT = 3
SUBJECTS_COUNT = len(SUBJECT_ORDER)
QUESTIONS_PER_LEVEL = QUESTIONS_PER_SUBJECT * SUBJECTS_COUNT   # 15
MAX_SCORE_PER_LEVEL = QUESTIONS_PER_LEVEL * 2                  # 30
PASSING_SCORE = 26                                              # max 2 mistakes
POINTS_CORRECT = 2
POINTS_WRONG = 2   # deducted
LEVEL_DURATION_MINUTES = 15
QUESTION_POOL_SIZE = 50   # per subject per level

# ── AI interaction types ──────────────────────────────────────────────────────
class AIRequestType(models.TextChoices):
    HINT = "hint", "Hint"
    EXPLANATION = "explanation", "Explanation"
    WRONG_ANSWER = "wrong_answer", "Wrong Answer Analysis"

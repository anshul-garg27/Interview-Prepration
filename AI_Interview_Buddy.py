#!/usr/bin/env python3
"""
🤖 AI INTERVIEW BUDDY
Intelligent practice partner that adapts to your learning style

CONCEPT: An AI that learns your strengths/weaknesses and provides
personalized interview training with real-time feedback
"""

import random
import json
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass, asdict
from collections import defaultdict

@dataclass
class PerformanceMetric:
    problem_id: str
    pattern: str
    difficulty: str
    time_taken: float
    attempts: int
    correctness_score: float
    confidence_level: int  # 1-10
    timestamp: str
    hints_used: int

@dataclass
class LearningProfile:
    user_id: str
    strong_patterns: List[str]
    weak_patterns: List[str]
    preferred_learning_style: str  # visual, auditory, kinesthetic, text
    optimal_session_length: int  # minutes
    best_practice_time: str  # morning, afternoon, evening
    retention_score: float
    last_updated: str

class AIInterviewBuddy:
    """
    🎯 ADAPTIVE AI INTERVIEW TRAINER
    
    Features:
    - Personalized difficulty progression
    - Learning style adaptation
    - Weakness detection and targeted practice
    - Spaced repetition system
    - Real-time performance analytics
    """
    
    def __init__(self):
        self.performance_history: List[PerformanceMetric] = []
        self.learning_profile: Optional[LearningProfile] = None
        self.problem_database = self._load_problem_database()
        self.encouragement_phrases = self._load_encouragement_database()
        
    def _load_problem_database(self) -> Dict:
        """Load comprehensive problem database with metadata"""
        return {
            "two_pointers_easy": {
                "pattern": "Two Pointers",
                "difficulty": "Easy",
                "problems": [
                    "Valid Palindrome", "Two Sum II", "Remove Duplicates",
                    "Move Zeroes", "Reverse String"
                ],
                "concepts": ["pointer movement", "convergence", "linear scan"]
            },
            "two_pointers_medium": {
                "pattern": "Two Pointers", 
                "difficulty": "Medium",
                "problems": [
                    "3Sum", "Container With Most Water", "Trapping Rain Water",
                    "Sort Colors", "Minimum Window Substring"
                ],
                "concepts": ["three pointers", "optimization", "sliding window hybrid"]
            },
            "binary_search_easy": {
                "pattern": "Binary Search",
                "difficulty": "Easy", 
                "problems": [
                    "Binary Search", "First Bad Version", "Search Insert Position"
                ],
                "concepts": ["divide and conquer", "sorted array", "logarithmic time"]
            },
            "dp_medium": {
                "pattern": "Dynamic Programming",
                "difficulty": "Medium",
                "problems": [
                    "Fibonacci", "Climbing Stairs", "Coin Change", 
                    "Longest Increasing Subsequence", "House Robber"
                ],
                "concepts": ["overlapping subproblems", "optimal substructure", "memoization"]
            }
        }
    
    def _load_encouragement_database(self) -> Dict[str, List[str]]:
        """Load personalized encouragement based on performance"""
        return {
            "struggling": [
                "🌟 Every expert was once a beginner! You're building strong foundations.",
                "💪 Difficult problems today become easy wins tomorrow!",
                "🧠 Your brain is literally creating new neural pathways right now!",
                "🎯 Progress isn't always visible, but it's always happening."
            ],
            "improving": [
                "🚀 I can see your pattern recognition getting stronger!",
                "📈 Your solution approach is becoming more systematic!",
                "⚡ You're starting to think like a senior developer!",
                "🎪 Your algorithm intuition is developing beautifully!"
            ],
            "excelling": [
                "🏆 You're crushing these problems! Your hard work is paying off!",
                "🔥 Your algorithmic thinking is at a professional level!",
                "🎉 Interviewers will be impressed with this level of mastery!",
                "👑 You're ready to tackle even the toughest interview challenges!"
            ]
        }
    
    def analyze_performance(self, user_id: str) -> LearningProfile:
        """🧠 AI ANALYSIS: Create personalized learning profile"""
        user_metrics = [m for m in self.performance_history if hasattr(m, 'user_id') and m.user_id == user_id]
        
        if not user_metrics:
            # Default profile for new users
            return LearningProfile(
                user_id=user_id,
                strong_patterns=[],
                weak_patterns=[],
                preferred_learning_style="visual",
                optimal_session_length=45,
                best_practice_time="morning",
                retention_score=0.5,
                last_updated=datetime.now().isoformat()
            )
        
        # Analyze pattern performance
        pattern_scores = defaultdict(list)
        for metric in user_metrics:
            pattern_scores[metric.pattern].append(metric.correctness_score)
        
        # Calculate average scores per pattern
        pattern_averages = {
            pattern: sum(scores) / len(scores) 
            for pattern, scores in pattern_scores.items()
        }
        
        # Identify strengths and weaknesses
        strong_patterns = [p for p, score in pattern_averages.items() if score >= 0.8]
        weak_patterns = [p for p, score in pattern_averages.items() if score < 0.6]
        
        # Analyze learning style preferences (simplified)
        visual_indicators = sum(1 for m in user_metrics if m.hints_used < 2)
        total_problems = len(user_metrics)
        preferred_style = "visual" if visual_indicators / total_problems > 0.6 else "text"
        
        # Calculate retention score
        recent_metrics = [m for m in user_metrics if 
                         datetime.fromisoformat(m.timestamp) > datetime.now() - timedelta(days=7)]
        retention_score = sum(m.correctness_score for m in recent_metrics) / len(recent_metrics) if recent_metrics else 0.5
        
        profile = LearningProfile(
            user_id=user_id,
            strong_patterns=strong_patterns,
            weak_patterns=weak_patterns,
            preferred_learning_style=preferred_style,
            optimal_session_length=45,  # Could be analyzed from session data
            best_practice_time="morning",  # Could be analyzed from timestamps
            retention_score=retention_score,
            last_updated=datetime.now().isoformat()
        )
        
        self.learning_profile = profile
        return profile
    
    def recommend_next_problem(self, user_id: str) -> Tuple[str, str, str]:
        """🎯 AI RECOMMENDATION: Smart next problem selection"""
        profile = self.analyze_performance(user_id)
        
        # Spaced repetition: Focus on weak patterns
        if profile.weak_patterns:
            target_pattern = random.choice(profile.weak_patterns)
            print(f"🎯 AI Focus: Working on your weak area - {target_pattern}")
        elif len(profile.strong_patterns) < 3:
            # Explore new patterns
            all_patterns = set(info["pattern"] for info in self.problem_database.values())
            known_patterns = set(profile.strong_patterns + profile.weak_patterns)
            new_patterns = list(all_patterns - known_patterns)
            target_pattern = random.choice(new_patterns) if new_patterns else "Dynamic Programming"
            print(f"🌟 AI Exploration: Learning new pattern - {target_pattern}")
        else:
            # Maintain strong patterns
            target_pattern = random.choice(profile.strong_patterns)
            print(f"💪 AI Maintenance: Keeping strong pattern sharp - {target_pattern}")
        
        # Find appropriate difficulty
        if profile.retention_score < 0.4:
            target_difficulty = "Easy"
        elif profile.retention_score > 0.8:
            target_difficulty = "Medium"
        else:
            target_difficulty = random.choice(["Easy", "Medium"])
        
        # Select specific problem
        matching_categories = [
            cat for cat, info in self.problem_database.items()
            if info["pattern"] == target_pattern and info["difficulty"] == target_difficulty
        ]
        
        if matching_categories:
            category = random.choice(matching_categories)
            problem = random.choice(self.problem_database[category]["problems"])
            return target_pattern, target_difficulty, problem
        else:
            return "Two Pointers", "Easy", "Valid Palindrome"  # Fallback
    
    def provide_adaptive_feedback(self, performance: PerformanceMetric) -> str:
        """🤖 AI FEEDBACK: Personalized encouragement and guidance"""
        feedback = []
        
        # Performance-based encouragement
        if performance.correctness_score >= 0.9:
            feedback.append(random.choice(self.encouragement_phrases["excelling"]))
        elif performance.correctness_score >= 0.7:
            feedback.append(random.choice(self.encouragement_phrases["improving"]))
        else:
            feedback.append(random.choice(self.encouragement_phrases["struggling"]))
        
        # Specific technical feedback
        if performance.attempts > 3:
            feedback.append("💡 Try breaking the problem into smaller steps next time.")
        
        if performance.time_taken > 30:  # minutes
            feedback.append("⏰ Focus on recognizing patterns faster - practice pattern identification!")
        
        if performance.hints_used > 2:
            feedback.append("🧩 Great job working through the hints! Try to solve similar problems without hints.")
        
        if performance.confidence_level < 5:
            feedback.append("🎯 Practice more problems of this pattern to build confidence!")
        
        return " ".join(feedback)
    
    def simulate_interview_session(self, user_id: str) -> str:
        """🎪 SIMULATE: Realistic interview session with AI feedback"""
        print("🤖 AI INTERVIEW BUDDY: Starting Personalized Session")
        print("=" * 60)
        
        # Get AI recommendation
        pattern, difficulty, problem = self.recommend_next_problem(user_id)
        
        print(f"📋 AI Selected Problem: {problem}")
        print(f"🎯 Pattern: {pattern} | Difficulty: {difficulty}")
        print(f"🤖 AI Says: This problem will help strengthen your {pattern} skills!")
        
        # Simulate problem solving
        print(f"\n⏱️  Starting timer... Good luck!")
        
        # Mock performance (in real app, this would be actual user interaction)
        mock_performance = PerformanceMetric(
            problem_id=problem,
            pattern=pattern,
            difficulty=difficulty,
            time_taken=random.uniform(10, 45),
            attempts=random.randint(1, 4),
            correctness_score=random.uniform(0.3, 1.0),
            confidence_level=random.randint(3, 10),
            timestamp=datetime.now().isoformat(),
            hints_used=random.randint(0, 3)
        )
        
        # Store performance
        self.performance_history.append(mock_performance)
        
        # Generate AI feedback
        feedback = self.provide_adaptive_feedback(mock_performance)
        
        print(f"\n🎯 PROBLEM COMPLETED!")
        print(f"⏱️  Time: {mock_performance.time_taken:.1f} minutes")
        print(f"🎯 Score: {mock_performance.correctness_score:.1%}")
        print(f"💪 Confidence: {mock_performance.confidence_level}/10")
        print(f"\n🤖 AI FEEDBACK:")
        print(f"   {feedback}")
        
        # Updated learning profile
        updated_profile = self.analyze_performance(user_id)
        
        print(f"\n📊 UPDATED AI ANALYSIS:")
        print(f"🏆 Strong Patterns: {', '.join(updated_profile.strong_patterns) or 'Building skills...'}")
        print(f"🎯 Focus Areas: {', '.join(updated_profile.weak_patterns) or 'All patterns developing well!'}")
        print(f"📈 Retention Score: {updated_profile.retention_score:.1%}")
        
        return feedback
    
    def generate_study_plan(self, user_id: str, days: int = 7) -> str:
        """📅 AI STUDY PLAN: Personalized weekly schedule"""
        profile = self.analyze_performance(user_id)
        
        plan = []
        plan.append(f"🤖 AI-GENERATED {days}-DAY STUDY PLAN")
        plan.append("=" * 50)
        plan.append(f"👤 Customized for: {user_id}")
        plan.append(f"📊 Based on {len(self.performance_history)} previous sessions")
        
        for day in range(1, days + 1):
            if profile.weak_patterns and day % 3 == 1:
                # Focus on weak areas every 3rd day
                focus = f"Weakness Focus: {random.choice(profile.weak_patterns)}"
            elif profile.strong_patterns and day % 3 == 2:
                # Maintain strong areas
                focus = f"Maintenance: {random.choice(profile.strong_patterns)}"
            else:
                # Explore new areas
                focus = "New Pattern Exploration"
            
            plan.append(f"\n📅 Day {day}: {focus}")
            plan.append(f"   ⏰ Duration: {profile.optimal_session_length} minutes")
            plan.append(f"   🎯 Problems: 2-3 {focus.split(':')[-1].strip() if ':' in focus else 'mixed'} problems")
        
        plan.append(f"\n🎯 AI OPTIMIZATION TIPS:")
        plan.append(f"   • Your best practice time: {profile.best_practice_time}")
        plan.append(f"   • Preferred learning style: {profile.preferred_learning_style}")
        plan.append(f"   • Focus extra time on: {', '.join(profile.weak_patterns) or 'pattern recognition speed'}")
        
        return "\n".join(plan)

# 🧪 DEMO: AI Interview Buddy in action
def demo_ai_buddy():
    """Demonstrate the AI Interview Buddy"""
    buddy = AIInterviewBuddy()
    
    # Simulate a few sessions for user "alex"
    print("🤖 AI INTERVIEW BUDDY DEMO")
    print("Training an AI to be your personal interview coach!\n")
    
    for session in range(3):
        print(f"\n🎬 SESSION {session + 1}:")
        buddy.simulate_interview_session("alex")
        print("\n" + "="*60)
    
    # Generate personalized study plan
    study_plan = buddy.generate_study_plan("alex", days=5)
    print(f"\n{study_plan}")

if __name__ == "__main__":
    demo_ai_buddy()

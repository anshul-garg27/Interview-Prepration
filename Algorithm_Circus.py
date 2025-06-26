#!/usr/bin/env python3
"""
🎪 ALGORITHM CIRCUS - MULTI-COMPANY INTERVIEW PREPARATION
Each tech company is a different circus act with unique performance styles!

CONCEPT: Train for different company interview styles like a circus performer
learning different acts. Each company has its own "performance style" and
preferred algorithms.
"""

from typing import Dict, List, Tuple
from dataclasses import dataclass
from enum import Enum
import random

class Company(Enum):
    GOOGLE = "Google"
    AMAZON = "Amazon" 
    FACEBOOK = "Meta"
    MICROSOFT = "Microsoft"
    APPLE = "Apple"
    NETFLIX = "Netflix"
    UBER = "Uber"
    AIRBNB = "Airbnb"

@dataclass
class CompanyProfile:
    name: str
    interview_style: str
    favorite_patterns: List[str]
    difficulty_preference: str
    unique_quirks: List[str]
    time_pressure: int  # 1-10 scale
    follow_up_intensity: int  # 1-10 scale
    coding_style_preferences: List[str]

@dataclass
class CircusAct:
    company: Company
    act_name: str
    description: str
    required_skills: List[str]
    performance_tips: List[str]
    common_mistakes: List[str]

class AlgorithmCircus:
    """
    🎪 MASTER THE ART OF COMPANY-SPECIFIC INTERVIEW PERFORMANCE
    
    Features:
    - Company-specific interview simulation
    - Tailored algorithm focus per company
    - Performance coaching for different styles
    - Multi-company comparison training
    """
    
    def __init__(self):
        self.company_profiles = self._create_company_profiles()
        self.circus_acts = self._create_circus_acts()
        self.performance_scores = {}
        
    def _create_company_profiles(self) -> Dict[Company, CompanyProfile]:
        """🏢 Create detailed profiles for each tech company"""
        return {
            Company.GOOGLE: CompanyProfile(
                name="Google",
                interview_style="Academic & Theoretical",
                favorite_patterns=[
                    "Graph Algorithms", "Dynamic Programming", "Trees", 
                    "System Design", "Math & Logic"
                ],
                difficulty_preference="Hard",
                unique_quirks=[
                    "Loves mathematical insights",
                    "Asks for multiple approaches", 
                    "Tests algorithmic knowledge depth",
                    "Expects optimal solutions immediately"
                ],
                time_pressure=7,
                follow_up_intensity=9,
                coding_style_preferences=[
                    "Clean, readable code", "Mathematical elegance", 
                    "Optimal complexity", "Edge case handling"
                ]
            ),
            
            Company.AMAZON: CompanyProfile(
                name="Amazon",
                interview_style="Practical & Leadership",
                favorite_patterns=[
                    "Two Pointers", "Sliding Window", "Trees", 
                    "Arrays", "Leadership Principles"
                ],
                difficulty_preference="Medium",
                unique_quirks=[
                    "Focuses on practical solutions",
                    "Tests leadership principles heavily",
                    "Prefers iterative over recursive",
                    "Values working code over perfect code"
                ],
                time_pressure=8,
                follow_up_intensity=6,
                coding_style_preferences=[
                    "Pragmatic solutions", "Clear variable names",
                    "Handles edge cases", "Production-ready code"
                ]
            ),
            
            Company.FACEBOOK: CompanyProfile(
                name="Meta",
                interview_style="Fast-Paced & Collaborative",
                favorite_patterns=[
                    "Graphs", "BFS/DFS", "Hash Maps", 
                    "Dynamic Programming", "String Manipulation"
                ],
                difficulty_preference="Medium-Hard",
                unique_quirks=[
                    "Fast-paced interviews",
                    "Expects quick pattern recognition",
                    "Tests collaboration skills",
                    "Loves graph problems (social networks!)"
                ],
                time_pressure=9,
                follow_up_intensity=8,
                coding_style_preferences=[
                    "Quick implementations", "Graph expertise",
                    "Hash-based solutions", "Scalable thinking"
                ]
            ),
            
            Company.MICROSOFT: CompanyProfile(
                name="Microsoft",
                interview_style="Collaborative & Growth-Minded",
                favorite_patterns=[
                    "Arrays", "Strings", "Trees", "Object-Oriented Design",
                    "System Architecture"
                ],
                difficulty_preference="Medium",
                unique_quirks=[
                    "Emphasizes learning and growth",
                    "Collaborative problem solving",
                    "Tests design thinking",
                    "Values process over perfect solutions"
                ],
                time_pressure=5,
                follow_up_intensity=7,
                coding_style_preferences=[
                    "Object-oriented design", "Maintainable code",
                    "Clear documentation", "Incremental improvement"
                ]
            )
        }
    
    def _create_circus_acts(self) -> Dict[Company, CircusAct]:
        """🎭 Create unique circus acts for each company"""
        return {
            Company.GOOGLE: CircusAct(
                company=Company.GOOGLE,
                act_name="The Mathematical Magician",
                description="Dazzle the audience with algorithmic elegance and mathematical insights",
                required_skills=[
                    "Advanced graph algorithms", "Complex dynamic programming",
                    "Mathematical problem solving", "Algorithm optimization"
                ],
                performance_tips=[
                    "Always explain the mathematical intuition first",
                    "Provide multiple solution approaches",
                    "Discuss time/space complexity in detail",
                    "Show deep algorithmic knowledge"
                ],
                common_mistakes=[
                    "Jumping to code without explaining approach",
                    "Not considering edge cases thoroughly",
                    "Giving only one solution method",
                    "Weak complexity analysis"
                ]
            ),
            
            Company.AMAZON: CircusAct(
                company=Company.AMAZON,
                act_name="The Practical Problem Solver",
                description="Demonstrate leadership and practical coding skills under pressure",
                required_skills=[
                    "Leadership principles", "Practical algorithms",
                    "Scalable solutions", "Real-world application"
                ],
                performance_tips=[
                    "Connect solutions to real business problems",
                    "Demonstrate leadership principles through examples",
                    "Focus on working code first, optimization second",
                    "Show customer obsession in your solutions"
                ],
                common_mistakes=[
                    "Over-engineering simple problems",
                    "Not mentioning leadership principles",
                    "Focusing too much on theory",
                    "Ignoring practical constraints"
                ]
            ),
            
            Company.FACEBOOK: CircusAct(
                company=Company.FACEBOOK,
                act_name="The Speed Demon Graph Master",
                description="Lightning-fast graph problem solving with social network flair",
                required_skills=[
                    "Graph algorithms mastery", "Quick pattern recognition",
                    "Hash-based solutions", "Social network modeling"
                ],
                performance_tips=[
                    "Recognize graph patterns immediately",
                    "Code quickly but accurately",
                    "Think in terms of social connections",
                    "Use hash maps liberally for optimization"
                ],
                common_mistakes=[
                    "Taking too long to start coding",
                    "Missing graph opportunities in problems",
                    "Over-complicating simple solutions",
                    "Not leveraging hash maps effectively"
                ]
            ),
            
            Company.MICROSOFT: CircusAct(
                company=Company.MICROSOFT,
                act_name="The Collaborative Builder",
                description="Show growth mindset and collaborative problem-solving skills",
                required_skills=[
                    "Object-oriented design", "Collaborative communication",
                    "Growth mindset demonstration", "System thinking"
                ],
                performance_tips=[
                    "Think out loud and collaborate",
                    "Show willingness to learn and adapt",
                    "Design clean, maintainable solutions",
                    "Ask clarifying questions actively"
                ],
                common_mistakes=[
                    "Working in silence",
                    "Being defensive about approaches",
                    "Not asking for help when stuck",
                    "Focusing only on algorithms, not design"
                ]
            )
        }
    
    def train_for_company(self, company: Company) -> str:
        """🎯 Get company-specific training program"""
        if company not in self.company_profiles:
            return f"❌ Company {company.value} not found in circus!"
        
        profile = self.company_profiles[company]
        act = self.circus_acts[company]
        
        training_program = f"""
🎪 CIRCUS TRAINING: {act.act_name}
═══════════════════════════════════════════════════════════

🏢 COMPANY: {profile.name}
🎭 CIRCUS ACT: {act.act_name}
📝 DESCRIPTION: {act.description}

🎯 INTERVIEW STYLE:
   {profile.interview_style}

⭐ FAVORITE ALGORITHM PATTERNS:
   • {chr(10).join('• ' + pattern for pattern in profile.favorite_patterns)}

🔥 DIFFICULTY PREFERENCE: {profile.difficulty_preference}
⏰ TIME PRESSURE: {profile.time_pressure}/10
🔄 FOLLOW-UP INTENSITY: {profile.follow_up_intensity}/10

🎪 REQUIRED CIRCUS SKILLS:
   • {chr(10).join('• ' + skill for skill in act.required_skills)}

💡 PERFORMANCE TIPS:
   • {chr(10).join('• ' + tip for tip in act.performance_tips)}

⚠️ COMMON MISTAKES TO AVOID:
   • {chr(10).join('• ' + mistake for mistake in act.common_mistakes)}

🎨 CODING STYLE PREFERENCES:
   • {chr(10).join('• ' + style for style in profile.coding_style_preferences)}

🦄 UNIQUE COMPANY QUIRKS:
   • {chr(10).join('• ' + quirk for quirk in profile.unique_quirks)}

🎯 TODAY'S TRAINING FOCUS:
   Practice {random.choice(profile.favorite_patterns)} problems with 
   {profile.interview_style.lower()} approach in mind!
        """
        
        return training_program
    
    def simulate_company_interview(self, company: Company) -> str:
        """🎬 Simulate a realistic company interview"""
        profile = self.company_profiles[company]
        act = self.circus_acts[company]
        
        # Select company-appropriate problem
        problems_by_company = {
            Company.GOOGLE: [
                "Implement a data structure for autocomplete",
                "Find the shortest path in a weighted graph",
                "Design a distributed cache system"
            ],
            Company.AMAZON: [
                "Design a package delivery optimization system", 
                "Implement a recommendation engine",
                "Find the most frequent items in a data stream"
            ],
            Company.FACEBOOK: [
                "Design a social network friend suggestion system",
                "Find mutual friends between users",
                "Implement a news feed ranking algorithm"
            ],
            Company.MICROSOFT: [
                "Design a collaborative document editing system",
                "Implement a file system with permissions",
                "Create a meeting scheduler with conflict resolution"
            ]
        }
        
        problem = random.choice(problems_by_company.get(company, ["Generic algorithm problem"]))
        
        simulation = f"""
🎬 LIVE INTERVIEW SIMULATION: {company.value}
═══════════════════════════════════════════════════════════

👨‍💼 INTERVIEWER: "Hello! I'm excited to work with you today. Let's dive into a problem that's very relevant to our work at {company.value}."

📋 PROBLEM: {problem}

🎭 PERFORMANCE MODE: {act.act_name}
⏰ TIME LIMIT: {45 - profile.time_pressure * 2} minutes
🔥 PRESSURE LEVEL: {profile.time_pressure}/10

🎯 WHAT THE INTERVIEWER IS LOOKING FOR:
   • {random.choice(act.performance_tips)}
   • {random.choice(profile.coding_style_preferences)}

⚡ COMPANY-SPECIFIC SUCCESS FACTORS:
   • Pattern: Focus on {random.choice(profile.favorite_patterns)}
   • Style: {profile.interview_style}
   • Quirk: Remember - {random.choice(profile.unique_quirks)}

🎪 YOUR CIRCUS ACT BEGINS NOW!
Good luck, and remember to embody "{act.act_name}"!

💬 START YOUR RESPONSE WITH:
"Thank you for the problem! Let me clarify a few things first..."
        """
        
        return simulation
    
    def compare_companies(self) -> str:
        """📊 Compare all companies side by side"""
        comparison = "📊 COMPANY COMPARISON CHART\n"
        comparison += "═" * 80 + "\n\n"
        
        comparison += f"{'Company':<12} {'Style':<20} {'Pressure':<8} {'Favorite Pattern':<20}\n"
        comparison += "─" * 80 + "\n"
        
        for company, profile in self.company_profiles.items():
            top_pattern = profile.favorite_patterns[0]
            comparison += f"{company.value:<12} {profile.interview_style[:18]:<20} {profile.time_pressure}/10    {top_pattern:<20}\n"
        
        comparison += "\n🎯 QUICK DECISION GUIDE:\n"
        comparison += "• High pressure, fast pace? → Meta/Facebook\n"
        comparison += "• Love math and theory? → Google\n" 
        comparison += "• Practical, leadership-focused? → Amazon\n"
        comparison += "• Collaborative, growth-minded? → Microsoft\n"
        
        return comparison
    
    def get_daily_circus_training(self) -> str:
        """🎪 Get today's randomized circus training"""
        company = random.choice(list(Company))
        profile = self.company_profiles[company]
        pattern = random.choice(profile.favorite_patterns)
        
        return f"""
🎪 TODAY'S CIRCUS TRAINING SPECIAL!
═══════════════════════════════════════════════════════════

🎭 Featured Act: {self.circus_acts[company].act_name}
🏢 Company Focus: {company.value}
🎯 Pattern Training: {pattern}
🎨 Style: {profile.interview_style}

🎪 TODAY'S CHALLENGE:
Solve 2-3 {pattern} problems while embodying the {company.value} interview style.
Focus on: {random.choice(profile.coding_style_preferences)}

🎯 Success Metric: 
{random.choice(self.circus_acts[company].performance_tips)}

🎪 Break a leg, circus performer! 🎭
        """

# 🎪 DEMO: Algorithm Circus in action
def demo_algorithm_circus():
    """Experience the Algorithm Circus!"""
    circus = AlgorithmCircus()
    
    print("🎪 WELCOME TO THE ALGORITHM CIRCUS!")
    print("═" * 60)
    print("Where every tech company is a different circus act to master!")
    
    # Show company comparison
    print(circus.compare_companies())
    
    # Train for specific company
    print("\n" + circus.train_for_company(Company.GOOGLE))
    
    # Simulate interview
    print("\n" + circus.simulate_company_interview(Company.AMAZON))
    
    # Daily training
    print("\n" + circus.get_daily_circus_training())

if __name__ == "__main__":
    demo_algorithm_circus()

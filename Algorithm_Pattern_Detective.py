#!/usr/bin/env python3
"""
🕵️ ALGORITHM PATTERN DETECTIVE
Interactive pattern recognition training game

CONCEPT: Present problem descriptions and train yourself to instantly
recognize which algorithm pattern to use - like a detective solving cases!
"""

import random
from typing import List, Dict, Tuple
from dataclasses import dataclass

@dataclass
class ProblemCase:
    title: str
    description: str
    hidden_pattern: str
    clues: List[str]
    difficulty: str
    company: str

class AlgorithmDetective:
    """
    🎯 TRAIN PATTERN RECOGNITION SKILLS
    
    Features:
    - Pattern recognition speed tests
    - Company-specific problem patterns
    - Progressive difficulty training
    - Pattern confidence scoring
    """
    
    def __init__(self):
        self.cases = self._load_mystery_cases()
        self.score = 0
        self.streak = 0
        
    def _load_mystery_cases(self) -> List[ProblemCase]:
        """Load mysterious algorithm cases to solve"""
        return [
            ProblemCase(
                title="The Case of the Missing Elements",
                description="Given an array where every element appears twice except one, find the single element. Must solve in O(n) time and O(1) space.",
                hidden_pattern="Bit Manipulation (XOR)",
                clues=["Appears twice", "Single element", "O(1) space", "Mathematical property"],
                difficulty="Easy",
                company="Google"
            ),
            
            ProblemCase(
                title="The Mystery of the Rotating Arrays",
                description="A sorted array has been rotated at some pivot. Find a target element in this rotated sorted array in O(log n) time.",
                hidden_pattern="Modified Binary Search",
                clues=["Sorted but rotated", "O(log n)", "Search problem", "Divide and conquer"],
                difficulty="Medium",
                company="Amazon"
            ),
            
            ProblemCase(
                title="The Puzzle of the Island Chains",
                description="Given a 2D grid of '1's and '0's, count the number of islands. An island is surrounded by water and formed by connecting adjacent lands.",
                hidden_pattern="DFS/BFS Graph Traversal",
                clues=["2D grid", "Connected components", "Adjacent cells", "Counting regions"],
                difficulty="Medium",
                company="Facebook"
            ),
            
            ProblemCase(
                title="The Enigma of Maximum Profit",
                description="You have prices of a stock for n days. You can complete at most k transactions. Find maximum profit you can achieve.",
                hidden_pattern="Dynamic Programming (2D)",
                clues=["Optimization problem", "Maximum/minimum", "Limited transactions", "Overlapping subproblems"],
                difficulty="Hard",
                company="Netflix"
            ),
            
            ProblemCase(
                title="The Riddle of the Sliding Window",
                description="Find the length of the longest substring without repeating characters in a given string.",
                hidden_pattern="Sliding Window (Variable Size)",
                clues=["Substring problem", "Without repeating", "Longest/shortest", "Contiguous elements"],
                difficulty="Medium",
                company="Apple"
            )
        ]
    
    def play_detective_round(self) -> bool:
        """🕵️ Play one round of pattern detective"""
        case = random.choice(self.cases)
        
        print(f"\n🕵️ NEW CASE: {case.title}")
        print(f"📍 Reported at: {case.company} ({case.difficulty})")
        print("=" * 60)
        print(f"📋 CASE DESCRIPTION:")
        print(f"   {case.description}")
        
        print(f"\n🔍 CLUES DISCOVERED:")
        for i, clue in enumerate(case.clues, 1):
            print(f"   {i}. {clue}")
        
        print(f"\n🎯 DETECTIVE CHALLENGE:")
        print("What algorithm pattern should you use to solve this case?")
        
        # Pattern options (including decoys)
        all_patterns = [
            "Two Pointers", "Sliding Window (Fixed Size)", "Sliding Window (Variable Size)",
            "Binary Search", "Modified Binary Search", "DFS Graph Traversal", 
            "BFS Graph Traversal", "Dynamic Programming (1D)", "Dynamic Programming (2D)",
            "Greedy Algorithm", "Backtracking", "Bit Manipulation (XOR)",
            "Heap/Priority Queue", "Union Find", "Trie", "Segment Tree"
        ]
        
        # Include correct answer and 3 random decoys
        options = [case.hidden_pattern]
        decoys = [p for p in all_patterns if p != case.hidden_pattern]
        options.extend(random.sample(decoys, 3))
        random.shuffle(options)
        
        print(f"\n📝 SUSPECT PATTERNS:")
        for i, pattern in enumerate(options, 1):
            print(f"   {i}. {pattern}")
        
        # Get user's guess
        try:
            choice = int(input(f"\nEnter your choice (1-{len(options)}): ")) - 1
            if 0 <= choice < len(options):
                selected_pattern = options[choice]
                
                if selected_pattern == case.hidden_pattern:
                    self.score += 10
                    self.streak += 1
                    print(f"\n🎉 CASE SOLVED! Excellent detective work!")
                    print(f"✅ Correct Pattern: {case.hidden_pattern}")
                    print(f"🏆 Score: +10 points | Streak: {self.streak}")
                    return True
                else:
                    self.streak = 0
                    print(f"\n❌ Case remains unsolved...")
                    print(f"🔍 You guessed: {selected_pattern}")
                    print(f"✅ Correct Pattern: {case.hidden_pattern}")
                    print(f"💭 Why {case.hidden_pattern}:")
                    self._explain_pattern_choice(case)
                    return False
            else:
                print("Invalid choice!")
                return False
        except ValueError:
            print("Please enter a valid number!")
            return False
    
    def _explain_pattern_choice(self, case: ProblemCase):
        """Explain why the correct pattern was chosen"""
        explanations = {
            "Bit Manipulation (XOR)": "XOR has the property that A ⊕ A = 0 and A ⊕ 0 = A. When all elements appear twice except one, XORing all elements cancels out pairs, leaving only the single element.",
            
            "Modified Binary Search": "Even though the array is rotated, we can still use binary search by checking which half is properly sorted and deciding which half to search next.",
            
            "DFS/BFS Graph Traversal": "This is a classic connected components problem. Each island is a connected component in an implicit graph where cells are nodes and adjacent cells are edges.",
            
            "Dynamic Programming (2D)": "We need to track two states: the day and the number of transactions used. This creates overlapping subproblems perfect for DP.",
            
            "Sliding Window (Variable Size)": "We need a window that expands when characters are unique and contracts when duplicates are found. The variable size is key."
        }
        
        explanation = explanations.get(case.hidden_pattern, "Pattern recognition comes with practice!")
        print(f"   {explanation}")
    
    def detective_training_session(self, rounds: int = 5):
        """🎮 Complete detective training session"""
        print("🕵️ ALGORITHM PATTERN DETECTIVE TRAINING")
        print("=" * 50)
        print("Welcome, Detective! Train your pattern recognition skills.")
        print("Each case tests your ability to identify the right algorithm approach.")
        
        correct_cases = 0
        
        for round_num in range(1, rounds + 1):
            print(f"\n🎯 ROUND {round_num}/{rounds}")
            if self.play_detective_round():
                correct_cases += 1
        
        # Final scoring
        print(f"\n🏆 DETECTIVE TRAINING COMPLETE!")
        print("=" * 50)
        print(f"📊 Cases Solved: {correct_cases}/{rounds}")
        print(f"🎯 Final Score: {self.score}")
        print(f"📈 Success Rate: {correct_cases/rounds*100:.1f}%")
        
        if correct_cases >= rounds * 0.8:
            print("🏅 MASTER DETECTIVE! You have excellent pattern recognition!")
        elif correct_cases >= rounds * 0.6:
            print("🥇 SKILLED DETECTIVE! Keep practicing to reach mastery!")
        else:
            print("📚 APPRENTICE DETECTIVE! Study the patterns and try again!")

# 🎮 DEMO: Play the detective game
def main():
    detective = AlgorithmDetective()
    detective.detective_training_session(rounds=3)

if __name__ == "__main__":
    main()

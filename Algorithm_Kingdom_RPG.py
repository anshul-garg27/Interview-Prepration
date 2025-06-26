#!/usr/bin/env python3
"""
🏰 ALGORITHM KINGDOM - RPG ADVENTURE
Turn interview prep into an epic fantasy adventure!

CONCEPT: You're a hero learning magical algorithms to save the kingdom.
Each algorithm is a spell, each problem is a quest, each pattern is a skill tree.
"""

from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum
import random

class AlgorithmElement(Enum):
    EARTH = "Dynamic Programming"  # Builds upon foundations
    FIRE = "Greedy"               # Fast and aggressive
    WATER = "Two Pointers"        # Fluid movement
    AIR = "Divide & Conquer"      # Splits and combines
    LIGHTNING = "Binary Search"    # Precise and fast
    SHADOW = "Backtracking"       # Explores then retreats

@dataclass
class Hero:
    name: str
    level: int
    experience: int
    health: int
    mana: int
    learned_spells: List[str]
    element_mastery: Dict[str, int]  # 0-100 mastery per element
    inventory: List[str]
    current_quest: Optional[str]

@dataclass
class Quest:
    name: str
    description: str
    required_spell: str
    element: AlgorithmElement
    difficulty: int
    rewards: Dict[str, int]
    boss_name: str

class AlgorithmKingdom:
    """
    🎮 FANTASY RPG FOR ALGORITHM LEARNING
    
    Features:
    - Spell system (algorithms)
    - Element mastery (algorithm patterns)
    - Boss battles (hard problems)
    - Skill trees (learning progression)
    - Epic storylines (problem narratives)
    """
    
    def __init__(self):
        self.hero: Optional[Hero] = None
        self.available_quests = self._create_kingdom_quests()
        self.spell_library = self._create_spell_library()
        self.kingdom_lore = self._create_kingdom_lore()
        
    def create_hero(self, name: str) -> Hero:
        """🧙 Create your algorithm hero"""
        hero = Hero(
            name=name,
            level=1,
            experience=0,
            health=100,
            mana=50,
            learned_spells=["Basic Search"],  # Starting spell
            element_mastery={element.value: 10 for element in AlgorithmElement},
            inventory=["Beginner's Coding Staff", "Scroll of Documentation"],
            current_quest=None
        )
        self.hero = hero
        return hero
        
    def _create_kingdom_quests(self) -> List[Quest]:
        """🗺️ Create epic quests across the Algorithm Kingdom"""
        return [
            Quest(
                name="The Mystery of the Vanishing Elements",
                description="The evil wizard DuplicateSort has cursed an array! Find the single element that appears only once while all others appear twice. The kingdom's balance depends on it!",
                required_spell="XOR Magic",
                element=AlgorithmElement.LIGHTNING,
                difficulty=3,
                rewards={"experience": 150, "mana": 20},
                boss_name="DuplicateSort the Destroyer"
            ),
            
            Quest(
                name="The Siege of the Rotating Towers",
                description="The Dark Lord has rotated the Crystal Towers of Sortington! Navigate through the twisted sorted array to find the mystical target element before the kingdom falls!",
                required_spell="Binary Search Mastery",
                element=AlgorithmElement.LIGHTNING,
                difficulty=5,
                rewards={"experience": 300, "health": 30},
                boss_name="Rotator Magnus"
            ),
            
            Quest(
                name="The Island Chain Liberation",
                description="Pirates have captured islands across the Great Grid Sea! Use your traversal magic to count and liberate all connected island chains. Each island freed brings hope to the kingdom!",
                required_spell="DFS Exploration",
                element=AlgorithmElement.SHADOW,
                difficulty=6,
                rewards={"experience": 400, "mana": 40},
                boss_name="Captain Disconnected"
            ),
            
            Quest(
                name="The Dragon's Treasure Optimization",
                description="The ancient dragon hoards treasures with different values and weights. Use your wisdom to maximize the treasure you can carry within your limited capacity!",
                required_spell="Dynamic Programming Mastery",
                element=AlgorithmElement.EARTH,
                difficulty=8,
                rewards={"experience": 600, "treasure": "Golden Algorithm Sword"},
                boss_name="Greed the Infinite Dragon"
            ),
            
            Quest(
                name="The Palindrome Palace Gates",
                description="The Palindrome Palace is under siege! Quickly determine if the magical gate inscriptions are valid palindromes to open the gates and save the royal family!",
                required_spell="Two Pointer Convergence",
                element=AlgorithmElement.WATER,
                difficulty=4,
                rewards={"experience": 250, "health": 25},
                boss_name="Mirror Lord Reverso"
            )
        ]
    
    def _create_spell_library(self) -> Dict[str, Dict]:
        """📚 Create the Great Spell Library"""
        return {
            "Basic Search": {
                "element": AlgorithmElement.EARTH,
                "mana_cost": 5,
                "description": "A simple linear search through the realm",
                "power": 20,
                "learning_time": "1 day"
            },
            
            "Binary Search Mastery": {
                "element": AlgorithmElement.LIGHTNING,
                "mana_cost": 15,
                "description": "Split the realm in half with lightning precision",
                "power": 70,
                "learning_time": "3 days"
            },
            
            "XOR Magic": {
                "element": AlgorithmElement.LIGHTNING,
                "mana_cost": 10,
                "description": "Ancient bit magic that reveals hidden truths",
                "power": 50,
                "learning_time": "2 days"
            },
            
            "DFS Exploration": {
                "element": AlgorithmElement.SHADOW,
                "mana_cost": 25,
                "description": "Dive deep into the unknown, leaving trails behind",
                "power": 80,
                "learning_time": "5 days"
            },
            
            "Dynamic Programming Mastery": {
                "element": AlgorithmElement.EARTH,
                "mana_cost": 40,
                "description": "The ultimate spell - build solutions from the ground up",
                "power": 120,
                "learning_time": "10 days"
            },
            
            "Two Pointer Convergence": {
                "element": AlgorithmElement.WATER,
                "mana_cost": 20,
                "description": "Graceful movement from both ends towards the center",
                "power": 60,
                "learning_time": "4 days"
            }
        }
    
    def _create_kingdom_lore(self) -> Dict[str, str]:
        """📜 Create rich backstory for the kingdom"""
        return {
            "origin": "Long ago, the Algorithm Kingdom was a chaotic realm where problems roamed wild and unsolved. The first Code Wizards brought order by learning the ancient algorithms, each representing a fundamental force of computational nature.",
            
            "elements": "The Five Elements of Algorithm Magic: Earth (builds foundations), Fire (burns through problems quickly), Water (flows around obstacles), Air (divides and conquers), and Lightning (strikes with precision).",
            
            "prophecy": "It is foretold that a chosen developer will master all algorithm elements and bring balance to the Interview Realm, where the dreaded Technical Interview Dragons guard the gates to the Employment Kingdom."
        }
    
    def start_quest(self, quest_name: str) -> str:
        """⚔️ Begin an epic quest"""
        if not self.hero:
            return "❌ Create a hero first!"
        
        quest = next((q for q in self.available_quests if q.name == quest_name), None)
        if not quest:
            return f"❌ Quest '{quest_name}' not found!"
        
        if quest.required_spell not in self.hero.learned_spells:
            return f"❌ You need to learn '{quest.required_spell}' first!"
        
        self.hero.current_quest = quest_name
        
        narrative = f"""
🏰 QUEST BEGINS: {quest.name}
═══════════════════════════════════════════════════════

📜 THE KINGDOM'S CALL:
{quest.description}

⚔️ YOUR MISSION:
Defeat {quest.boss_name} using your {quest.required_spell} spell!

🔮 REQUIRED ELEMENT: {quest.element.value}
⭐ DIFFICULTY: {quest.difficulty}/10
🎁 REWARDS: {', '.join(f'{k}: {v}' for k, v in quest.rewards.items())}

🧙 Hero {self.hero.name} steps forward, staff glowing with {quest.element.value} energy...

The adventure begins! Will you emerge victorious?
        """
        
        return narrative
    
    def learn_spell(self, spell_name: str) -> str:
        """📖 Learn a new algorithm spell"""
        if not self.hero:
            return "❌ Create a hero first!"
        
        if spell_name in self.hero.learned_spells:
            return f"✅ You already know {spell_name}!"
        
        if spell_name not in self.spell_library:
            return f"❌ Spell '{spell_name}' doesn't exist in the library!"
        
        spell = self.spell_library[spell_name]
        required_mana = spell["mana_cost"]
        
        if self.hero.mana < required_mana:
            return f"❌ Insufficient mana! Need {required_mana}, have {self.hero.mana}"
        
        # Learn the spell
        self.hero.mana -= required_mana
        self.hero.learned_spells.append(spell_name)
        
        # Increase element mastery
        element = spell["element"].value
        self.hero.element_mastery[element] = min(100, self.hero.element_mastery[element] + 15)
        
        learning_story = f"""
📚 SPELL LEARNING: {spell_name}
═══════════════════════════════════════════════════════

🔮 Element: {spell["element"].value}
💙 Mana Cost: {required_mana} (Remaining: {self.hero.mana})
⚡ Power Level: {spell["power"]}
⏰ Learning Time: {spell["learning_time"]}

📖 DESCRIPTION:
{spell["description"]}

🎉 CONGRATULATIONS!
Hero {self.hero.name} has mastered the ancient art of {spell_name}!
Your {spell["element"].value} mastery increased to {self.hero.element_mastery[element]}%

✨ You feel the knowledge flowing through your mind like liquid lightning...
        """
        
        return learning_story
    
    def view_hero_status(self) -> str:
        """📊 Check your hero's current status"""
        if not self.hero:
            return "❌ No hero created yet!"
        
        status = f"""
🧙 HERO STATUS: {self.hero.name}
═══════════════════════════════════════════════════════

📊 CORE STATS:
   Level: {self.hero.level}
   Experience: {self.hero.experience} XP
   Health: {self.hero.health}/100 ❤️
   Mana: {self.hero.mana}/100 💙

🔮 LEARNED SPELLS:
   {', '.join(self.hero.learned_spells)}

⚡ ELEMENT MASTERY:
"""
        
        for element, mastery in self.hero.element_mastery.items():
            status += f"   {element}: {mastery}% {'🔥' if mastery >= 80 else '⭐' if mastery >= 50 else '📘'}\n"
        
        status += f"\n🎒 INVENTORY:\n   {', '.join(self.hero.inventory)}"
        
        if self.hero.current_quest:
            status += f"\n\n🗡️ CURRENT QUEST: {self.hero.current_quest}"
        
        return status
    
    def view_available_quests(self) -> str:
        """🗺️ View all available kingdom quests"""
        quest_list = "🗺️ AVAILABLE KINGDOM QUESTS\n"
        quest_list += "═" * 50 + "\n\n"
        
        for i, quest in enumerate(self.available_quests, 1):
            difficulty_stars = "⭐" * quest.difficulty
            quest_list += f"{i}. {quest.name} {difficulty_stars}\n"
            quest_list += f"   Boss: {quest.boss_name}\n"
            quest_list += f"   Required: {quest.required_spell}\n"
            quest_list += f"   Element: {quest.element.value}\n\n"
        
        return quest_list

# 🎮 DEMO: Algorithm Kingdom Adventure
def demo_algorithm_kingdom():
    """Experience the Algorithm Kingdom!"""
    kingdom = AlgorithmKingdom()
    
    print("🏰 WELCOME TO THE ALGORITHM KINGDOM!")
    print("═" * 60)
    print("A realm where algorithms are magical spells and problems are epic quests!")
    
    # Create hero
    hero = kingdom.create_hero("CodeMaster Alex")
    print(f"\n🧙 Hero Created: {hero.name}")
    
    # View hero status
    print(kingdom.view_hero_status())
    
    # Learn a new spell
    print("\n" + kingdom.learn_spell("Binary Search Mastery"))
    
    # View available quests
    print("\n" + kingdom.view_available_quests())
    
    # Start a quest
    print(kingdom.start_quest("The Siege of the Rotating Towers"))

if __name__ == "__main__":
    demo_algorithm_kingdom()

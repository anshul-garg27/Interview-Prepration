# 🧮 Math & Bit Manipulation - Complete Mastery Guide

## 📚 Understanding Bits and Binary

### What are Bits?
Bits are the smallest unit of data - either 0 or 1. Everything in computers is represented using bits.

### Binary Number System:
```
Decimal vs Binary:
0 = 0000
1 = 0001  
2 = 0010
3 = 0011
4 = 0100
5 = 0101
6 = 0110
7 = 0111
8 = 1000

Each position represents a power of 2:
Position: 3 2 1 0
Value:    8 4 2 1

Example: 5 in binary
5 = 4 + 1 = 0101
    ↑   ↑
   2² + 2⁰
```

### Visual Bit Representation:
```python
def show_bits(n, bits=8):
    """Show binary representation of number"""
    binary = bin(n)[2:].zfill(bits)
    print(f"{n:3d} = {binary} = ", end="")
    
    # Show place values
    total = 0
    terms = []
    for i, bit in enumerate(reversed(binary)):
        if bit == '1':
            power = 2 ** i
            terms.append(f"2^{i}")
            total += power
    
    print(" + ".join(terms) if terms else "0")
    return binary

# Show examples
print("Decimal to Binary conversion:")
for i in range(16):
    show_bits(i, 4)
```

## 🎯 Pattern 1: Basic Bit Operations

### The 6 Essential Bit Operations:

#### 1. AND (&) - Both bits must be 1
```
  1010  (10)
& 1100  (12)
  ----
  1000  (8)

Use case: Check if specific bit is set
```

#### 2. OR (|) - At least one bit must be 1
```
  1010  (10)
| 1100  (12)
  ----
  1110  (14)

Use case: Set specific bit to 1
```

#### 3. XOR (^) - Bits must be different
```
  1010  (10)
^ 1100  (12)
  ----
  0110  (6)

Use case: Toggle bits, find differences
```

#### 4. NOT (~) - Flip all bits
```
~1010 = 0101 (in 4-bit representation)

Use case: Get complement
```

#### 5. Left Shift (<<) - Multiply by 2^n
```
1010 << 1 = 10100 (multiply by 2)
1010 << 2 = 101000 (multiply by 4)

Use case: Fast multiplication by powers of 2
```

#### 6. Right Shift (>>) - Divide by 2^n
```
1010 >> 1 = 0101 (divide by 2)
1010 >> 2 = 0010 (divide by 4)

Use case: Fast division by powers of 2
```

### Implementation and Examples:
```python
def demonstrate_bit_operations():
    """Show all basic bit operations"""
    a, b = 10, 12  # 1010 and 1100 in binary
    
    print(f"a = {a} = {bin(a)}")
    print(f"b = {b} = {bin(b)}")
    print()
    
    print("Basic Operations:")
    print(f"a & b = {a & b} = {bin(a & b)} (AND)")
    print(f"a | b = {a | b} = {bin(a | b)} (OR)")
    print(f"a ^ b = {a ^ b} = {bin(a ^ b)} (XOR)")
    print(f"~a = {~a & 0xFF} = {bin(~a & 0xFF)} (NOT, 8-bit)")
    print(f"a << 1 = {a << 1} = {bin(a << 1)} (Left shift)")
    print(f"a >> 1 = {a >> 1} = {bin(a >> 1)} (Right shift)")

demonstrate_bit_operations()
```

## 🎯 Pattern 2: Bit Manipulation Tricks

### Trick 1: Check if Number is Power of 2
```
Power of 2 has exactly one bit set:
1 = 0001
2 = 0010  
4 = 0100
8 = 1000

Key insight: n & (n-1) == 0 for powers of 2
```

### Visual Explanation:
```python
def is_power_of_two(n):
    """Check if number is power of 2"""
    if n <= 0:
        return False
    
    print(f"Checking if {n} is power of 2:")
    print(f"n = {n} = {bin(n)}")
    print(f"n-1 = {n-1} = {bin(n-1)}")
    print(f"n & (n-1) = {n & (n-1)} = {bin(n & (n-1))}")
    
    result = (n & (n-1)) == 0
    print(f"Is power of 2: {result}")
    return result

# Test with various numbers
test_numbers = [1, 2, 3, 4, 5, 8, 10, 16]
for num in test_numbers:
    is_power_of_two(num)
    print()
```

### Trick 2: Count Number of 1 bits (Hamming Weight)
```python
def count_bits_builtin(n):
    """Count 1 bits using built-in function"""
    return bin(n).count('1')

def count_bits_manual(n):
    """Count 1 bits manually"""
    count = 0
    print(f"Counting bits in {n} = {bin(n)}:")
    
    while n:
        if n & 1:  # Check if rightmost bit is 1
            count += 1
            print(f"  Found 1 at position, count = {count}")
        n >>= 1  # Right shift to check next bit
        if n:
            print(f"  After shift: {bin(n)}")
    
    return count

def count_bits_brian_kernighan(n):
    """Brian Kernighan's algorithm - faster!"""
    count = 0
    print(f"Counting bits in {n} = {bin(n)} (Brian Kernighan):")
    
    while n:
        count += 1
        print(f"  n = {bin(n)}")
        n = n & (n - 1)  # Remove rightmost 1 bit
        print(f"  After n & (n-1): {bin(n) if n else '0'}")
    
    return count

# Test different methods
n = 13  # 1101 in binary
print("Method 1 (built-in):", count_bits_builtin(n))
print("\nMethod 2 (manual):")
count_bits_manual(n)
print("\nMethod 3 (Brian Kernighan):")
count_bits_brian_kernighan(n)
```

### Trick 3: Get/Set/Clear Specific Bit
```python
def bit_operations_on_position(n, pos):
    """Demonstrate get/set/clear bit at position"""
    print(f"Working with number {n} = {bin(n)}")
    print(f"Position {pos} (0-indexed from right)")
    
    # Get bit at position
    get_bit = (n >> pos) & 1
    print(f"Get bit at pos {pos}: {get_bit}")
    
    # Set bit at position to 1
    set_bit = n | (1 << pos)
    print(f"Set bit at pos {pos}: {set_bit} = {bin(set_bit)}")
    
    # Clear bit at position (set to 0)
    clear_bit = n & ~(1 << pos)
    print(f"Clear bit at pos {pos}: {clear_bit} = {bin(clear_bit)}")
    
    # Toggle bit at position
    toggle_bit = n ^ (1 << pos)
    print(f"Toggle bit at pos {pos}: {toggle_bit} = {bin(toggle_bit)}")

# Test bit operations
bit_operations_on_position(13, 2)  # 1101, position 2
```

## 🎯 Pattern 3: XOR Magic Tricks

### XOR Properties:
```
a ^ a = 0     (anything XOR itself = 0)
a ^ 0 = a     (anything XOR 0 = itself)
a ^ b = b ^ a (commutative)
(a ^ b) ^ c = a ^ (b ^ c) (associative)
```

### Problem 1: Find Single Number
Given array where every element appears twice except one, find the single element.

```python
def find_single_number(nums):
    """Find single number using XOR"""
    result = 0
    print(f"Array: {nums}")
    print("XOR process:")
    
    for i, num in enumerate(nums):
        result ^= num
        print(f"Step {i+1}: {result} = previous ^ {num} = {bin(result)}")
    
    print(f"Single number: {result}")
    return result

# Test: [2, 2, 1] should return 1
# Because: 2 ^ 2 ^ 1 = 0 ^ 1 = 1
nums = [2, 2, 1, 3, 3, 4, 4]
find_single_number(nums)
```

### Problem 2: Swap Two Numbers Without Temp Variable
```python
def swap_without_temp(a, b):
    """Swap two numbers using XOR"""
    print(f"Original: a = {a}, b = {b}")
    
    a = a ^ b
    print(f"Step 1: a = a ^ b = {a}")
    
    b = a ^ b  # b = (a ^ b) ^ b = a
    print(f"Step 2: b = a ^ b = {b}")
    
    a = a ^ b  # a = (a ^ b) ^ a = b
    print(f"Step 3: a = a ^ b = {a}")
    
    print(f"Swapped: a = {a}, b = {b}")
    return a, b

# Test swap
swap_without_temp(5, 7)
```

## 🎯 Pattern 4: Mathematical Problem Solving

### Problem 1: Reverse Integer
```python
def reverse_integer(x):
    """Reverse digits of integer"""
    sign = -1 if x < 0 else 1
    x = abs(x)
    
    reversed_num = 0
    print(f"Reversing {x * sign}:")
    
    while x:
        digit = x % 10
        reversed_num = reversed_num * 10 + digit
        x //= 10
        print(f"  Extracted digit {digit}, reversed so far: {reversed_num}")
    
    result = sign * reversed_num
    
    # Check for 32-bit integer overflow
    if result > 2**31 - 1 or result < -2**31:
        print("  Overflow detected, returning 0")
        return 0
    
    print(f"Final result: {result}")
    return result

# Test reverse integer
reverse_integer(123)
reverse_integer(-123)
```

### Problem 2: Palindrome Number
```python
def is_palindrome_number(x):
    """Check if number is palindrome without converting to string"""
    if x < 0:
        return False
    
    original = x
    reversed_num = 0
    
    print(f"Checking if {x} is palindrome:")
    
    while x > 0:
        digit = x % 10
        reversed_num = reversed_num * 10 + digit
        x //= 10
        print(f"  Extracted {digit}, building reverse: {reversed_num}")
    
    is_palindrome = original == reversed_num
    print(f"Original: {original}, Reversed: {reversed_num}")
    print(f"Is palindrome: {is_palindrome}")
    return is_palindrome

# Test palindrome
is_palindrome_number(121)
is_palindrome_number(123)
```

### Problem 3: Count Primes (Sieve of Eratosthenes)
```python
def count_primes(n):
    """Count prime numbers less than n using Sieve of Eratosthenes"""
    if n <= 2:
        return 0
    
    # Initially assume all numbers are prime
    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False  # 0 and 1 are not prime
    
    print(f"Finding primes less than {n}:")
    
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            print(f"  {i} is prime, marking its multiples as composite:")
            # Mark all multiples of i as composite
            for j in range(i * i, n, i):
                if is_prime[j]:
                    print(f"    Marking {j} as composite")
                is_prime[j] = False
    
    primes = [i for i in range(2, n) if is_prime[i]]
    print(f"Primes less than {n}: {primes}")
    return len(primes)

# Test prime counting
count_primes(20)
```

## 🎯 Pattern 5: Advanced Bit Manipulation

### Problem 1: Missing Number
Find missing number from 0 to n array.

```python
def find_missing_number(nums):
    """Find missing number using XOR"""
    n = len(nums)
    
    # XOR all numbers from 0 to n
    expected_xor = 0
    for i in range(n + 1):
        expected_xor ^= i
    
    # XOR all numbers in array
    actual_xor = 0
    for num in nums:
        actual_xor ^= num
    
    # Missing number = expected_xor ^ actual_xor
    missing = expected_xor ^ actual_xor
    
    print(f"Array: {nums}")
    print(f"Expected XOR (0 to {n}): {expected_xor}")
    print(f"Actual XOR: {actual_xor}")
    print(f"Missing number: {missing}")
    
    return missing

# Test missing number
nums = [3, 0, 1]  # Missing 2
find_missing_number(nums)
```

### Problem 2: Single Number III
Two numbers appear once, others appear twice. Find both numbers.

```python
def find_two_single_numbers(nums):
    """Find two single numbers using bit manipulation"""
    # XOR all numbers - result will be XOR of the two unique numbers
    xor_all = 0
    for num in nums:
        xor_all ^= num
    
    print(f"Array: {nums}")
    print(f"XOR of all elements: {xor_all} = {bin(xor_all)}")
    
    # Find rightmost set bit in xor_all
    rightmost_set_bit = xor_all & (-xor_all)
    print(f"Rightmost set bit: {rightmost_set_bit} = {bin(rightmost_set_bit)}")
    
    # Divide numbers into two groups based on this bit
    num1 = num2 = 0
    
    for num in nums:
        if num & rightmost_set_bit:
            num1 ^= num
        else:
            num2 ^= num
    
    print(f"Two single numbers: {num1}, {num2}")
    return [num1, num2]

# Test: [1,2,1,3,2,5] should return [3,5]
nums = [1, 2, 1, 3, 2, 5]
find_two_single_numbers(nums)
```

## 🧠 When to Use Math & Bit Manipulation

### Use Bit Manipulation for:
- **Space optimization**: Compress multiple boolean flags
- **Fast operations**: Powers of 2, checking even/odd
- **XOR problems**: Finding unique elements, swapping
- **Set operations**: Union, intersection using bits

### Use Mathematical Approaches for:
- **Number theory**: Prime numbers, GCD, LCM
- **Digit manipulation**: Reverse, palindrome checks
- **Modular arithmetic**: Large number computations
- **Geometric problems**: Distance, area calculations

## 🎯 Practice Problems

### Bit Manipulation:
1. **Number of 1 Bits** - Basic bit counting
2. **Power of Two** - Single bit check
3. **Single Number** - XOR properties
4. **Missing Number** - XOR or math approach
5. **Reverse Bits** - Bit manipulation practice

### Mathematical:
1. **Reverse Integer** - Digit manipulation
2. **Palindrome Number** - Without string conversion
3. **Roman to Integer** - String processing with math
4. **Count Primes** - Sieve algorithm
5. **Happy Number** - Cycle detection in math

### Advanced:
1. **Single Number III** - Complex XOR usage
2. **Maximum XOR** - Trie with bit manipulation
3. **Divide Two Integers** - Without division operator

## 📝 Quick Reference

### Bit Manipulation Cheat Sheet:
```python
# Check if bit i is set
(n >> i) & 1

# Set bit i
n | (1 << i)

# Clear bit i  
n & ~(1 << i)

# Toggle bit i
n ^ (1 << i)

# Check if power of 2
n > 0 and (n & (n-1)) == 0

# Count set bits
bin(n).count('1')

# Get rightmost set bit
n & (-n)
```

### Common XOR Patterns:
```python
# Find single number in pairs
result = 0
for num in nums:
    result ^= num

# Swap without temp
a ^= b
b ^= a  
a ^= b
```

This comprehensive guide covers all essential math and bit manipulation patterns with detailed explanations and visual examples!

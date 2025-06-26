# 🏗️ System Design Fundamentals
*Master the building blocks of scalable systems*

## 📚 Table of Contents
1. [Introduction to System Design](#introduction)
2. [Scalability Fundamentals](#scalability)
3. [Reliability & Availability](#reliability)
4. [Consistency Models](#consistency)
5. [Performance Metrics](#performance)
6. [Practice Problems](#practice)

---

## 🎯 Introduction to System Design {#introduction}

### What is System Design?
System design is the process of architecting software systems that can handle large-scale requirements while maintaining reliability, scalability, and performance.

### Key Principles
```
🔹 Scalability: Handle growing load
🔹 Reliability: System works consistently
🔹 Availability: System is accessible
🔹 Consistency: Data integrity across system
🔹 Partition Tolerance: Works despite network issues
```

### System Design Interview Process
```
1. 📋 Clarify Requirements (5-10 min)
   - Functional requirements
   - Non-functional requirements
   - Scale estimation

2. 🎯 High-Level Design (10-15 min)
   - Core components
   - API design
   - Data flow

3. 🔧 Detailed Design (15-20 min)
   - Database schema
   - Algorithm details
   - Component interactions

4. 🚀 Scale & Optimize (5-10 min)
   - Bottlenecks identification
   - Scaling strategies
   - Trade-offs discussion
```

---

## 📈 Scalability Fundamentals {#scalability}

### Vertical vs Horizontal Scaling

#### Vertical Scaling (Scale Up)
```
💡 Definition: Adding more power to existing machine

✅ Pros:
- Simple to implement
- No application changes needed
- Strong consistency

❌ Cons:
- Hardware limits
- Single point of failure
- Expensive at scale

🎯 Use Cases:
- Databases (initially)
- Legacy applications
- Applications requiring strong consistency
```

#### Horizontal Scaling (Scale Out)
```
💡 Definition: Adding more machines to resource pool

✅ Pros:
- Nearly unlimited scaling
- Better fault tolerance
- Cost effective

❌ Cons:
- Application complexity
- Data consistency challenges
- Network overhead

🎯 Use Cases:
- Web servers
- Microservices
- Distributed systems
```

### Load Balancing Strategies

#### 1. Round Robin
```python
class RoundRobinBalancer:
    def __init__(self, servers):
        self.servers = servers
        self.current = 0
    
    def get_server(self):
        server = self.servers[self.current]
        self.current = (self.current + 1) % len(self.servers)
        return server

# Example usage
balancer = RoundRobinBalancer(['server1', 'server2', 'server3'])
print(balancer.get_server())  # server1
print(balancer.get_server())  # server2
```

#### 2. Weighted Round Robin
```python
class WeightedRoundRobinBalancer:
    def __init__(self, servers_weights):
        self.servers_weights = servers_weights
        self.current_weights = {server: 0 for server in servers_weights}
    
    def get_server(self):
        # Find server with highest current weight
        server = max(self.current_weights.keys(), 
                    key=lambda s: self.current_weights[s])
        
        # Decrease current weight by total weight
        total_weight = sum(self.servers_weights.values())
        self.current_weights[server] -= total_weight
        
        # Increase all current weights by their configured weight
        for s in self.current_weights:
            self.current_weights[s] += self.servers_weights[s]
        
        return server

# Example: server1 gets 3x traffic, server2 gets 1x
balancer = WeightedRoundRobinBalancer({'server1': 3, 'server2': 1})
```

#### 3. Least Connections
```python
class LeastConnectionsBalancer:
    def __init__(self, servers):
        self.servers = {server: 0 for server in servers}
    
    def get_server(self):
        return min(self.servers.keys(), key=lambda s: self.servers[s])
    
    def connection_opened(self, server):
        self.servers[server] += 1
    
    def connection_closed(self, server):
        self.servers[server] -= 1
```

---

## 🛡️ Reliability & Availability {#reliability}

### Reliability Patterns

#### 1. Circuit Breaker
```python
import time
from enum import Enum

class CircuitState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"

class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout=60):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = CircuitState.CLOSED
    
    def call(self, func, *args, **kwargs):
        if self.state == CircuitState.OPEN:
            if time.time() - self.last_failure_time > self.timeout:
                self.state = CircuitState.HALF_OPEN
            else:
                raise Exception("Circuit breaker is OPEN")
        
        try:
            result = func(*args, **kwargs)
            self.on_success()
            return result
        except Exception as e:
            self.on_failure()
            raise e
    
    def on_success(self):
        self.failure_count = 0
        self.state = CircuitState.CLOSED
    
    def on_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        
        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN

# Usage
def unreliable_service():
    import random
    if random.random() < 0.7:  # 70% failure rate
        raise Exception("Service failed")
    return "Success"

cb = CircuitBreaker(failure_threshold=3, timeout=30)
try:
    result = cb.call(unreliable_service)
    print(result)
except Exception as e:
    print(f"Failed: {e}")
```

#### 2. Retry with Exponential Backoff
```python
import time
import random

def retry_with_exponential_backoff(func, max_retries=3, base_delay=1, max_delay=60):
    """
    Retry function with exponential backoff and jitter
    """
    for attempt in range(max_retries + 1):
        try:
            return func()
        except Exception as e:
            if attempt == max_retries:
                raise e
            
            # Calculate delay with exponential backoff
            delay = min(base_delay * (2 ** attempt), max_delay)
            
            # Add jitter to prevent thundering herd
            jitter = random.uniform(0, delay * 0.1)
            sleep_time = delay + jitter
            
            print(f"Attempt {attempt + 1} failed. Retrying in {sleep_time:.2f}s")
            time.sleep(sleep_time)

# Usage
def flaky_api_call():
    import random
    if random.random() < 0.8:  # 80% failure rate
        raise Exception("API temporarily unavailable")
    return {"data": "success"}

try:
    result = retry_with_exponential_backoff(flaky_api_call, max_retries=5)
    print(f"Success: {result}")
except Exception as e:
    print(f"All retries failed: {e}")
```

### Availability Calculations

#### SLA Calculations
```python
def calculate_downtime(availability_percentage):
    """Calculate allowed downtime for different time periods"""
    uptime = availability_percentage / 100
    downtime = 1 - uptime
    
    periods = {
        "Per Year": 365.25 * 24 * 60 * 60,
        "Per Month": 30.44 * 24 * 60 * 60,
        "Per Week": 7 * 24 * 60 * 60,
        "Per Day": 24 * 60 * 60
    }
    
    print(f"Availability: {availability_percentage}%")
    print("Allowed Downtime:")
    
    for period, seconds in periods.items():
        downtime_seconds = downtime * seconds
        
        if downtime_seconds >= 3600:
            downtime_hours = downtime_seconds / 3600
            print(f"  {period}: {downtime_hours:.2f} hours")
        elif downtime_seconds >= 60:
            downtime_minutes = downtime_seconds / 60
            print(f"  {period}: {downtime_minutes:.2f} minutes")
        else:
            print(f"  {period}: {downtime_seconds:.2f} seconds")

# Common SLA levels
calculate_downtime(99.9)    # Three nines
print()
calculate_downtime(99.99)   # Four nines
print()
calculate_downtime(99.999)  # Five nines
```

---

## 🔄 Consistency Models {#consistency}

### CAP Theorem
```
🎯 CAP Theorem: You can only guarantee 2 out of 3:

C - Consistency: All nodes see the same data simultaneously
A - Availability: System remains operational
P - Partition Tolerance: System continues despite network failures

🔹 CP Systems: Consistent + Partition Tolerant
   Examples: MongoDB, Redis, HBase
   
🔹 AP Systems: Available + Partition Tolerant
   Examples: Cassandra, DynamoDB, CouchDB
   
🔹 CA Systems: Consistent + Available
   Examples: RDBMS (when no partitions)
```

### Consistency Levels

#### 1. Strong Consistency
```python
class StrongConsistentStore:
    """
    All reads receive the most recent write
    High latency, but guaranteed consistency
    """
    def __init__(self):
        self.data = {}
        self.version = 0
        self.lock = threading.Lock()
    
    def write(self, key, value):
        with self.lock:
            self.data[key] = (value, self.version)
            self.version += 1
            # Wait for all replicas to acknowledge
            self._replicate_to_all(key, value, self.version)
    
    def read(self, key):
        with self.lock:
            if key in self.data:
                return self.data[key][0]
            return None
```

#### 2. Eventual Consistency
```python
class EventuallyConsistentStore:
    """
    System will become consistent over time
    Higher availability, lower latency
    """
    def __init__(self, node_id):
        self.node_id = node_id
        self.data = {}
        self.vector_clock = {}
    
    def write(self, key, value):
        # Write locally first
        self.vector_clock[self.node_id] = self.vector_clock.get(self.node_id, 0) + 1
        self.data[key] = {
            'value': value,
            'timestamp': time.time(),
            'vector_clock': self.vector_clock.copy()
        }
        
        # Asynchronously propagate to other nodes
        self._async_replicate(key, value)
    
    def read(self, key):
        # Return local value (may be stale)
        if key in self.data:
            return self.data[key]['value']
        return None
    
    def _resolve_conflicts(self, local_entry, remote_entry):
        """Use last-write-wins or vector clock comparison"""
        if remote_entry['timestamp'] > local_entry['timestamp']:
            return remote_entry
        return local_entry
```

---

## 📊 Performance Metrics {#performance}

### Key Metrics to Monitor

#### 1. Latency Metrics
```python
import time
import statistics
from collections import deque

class LatencyTracker:
    def __init__(self, window_size=1000):
        self.latencies = deque(maxlen=window_size)
    
    def record_latency(self, latency_ms):
        self.latencies.append(latency_ms)
    
    def get_metrics(self):
        if not self.latencies:
            return {}
        
        latencies = list(self.latencies)
        latencies.sort()
        
        return {
            'mean': statistics.mean(latencies),
            'median': statistics.median(latencies),
            'p95': latencies[int(len(latencies) * 0.95)],
            'p99': latencies[int(len(latencies) * 0.99)],
            'min': min(latencies),
            'max': max(latencies)
        }

# Usage with context manager
class APILatencyTracker:
    def __init__(self, tracker):
        self.tracker = tracker
        self.start_time = None
    
    def __enter__(self):
        self.start_time = time.time()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        end_time = time.time()
        latency_ms = (end_time - self.start_time) * 1000
        self.tracker.record_latency(latency_ms)

# Example usage
tracker = LatencyTracker()

# Simulate API calls
for _ in range(100):
    with APILatencyTracker(tracker):
        time.sleep(0.01)  # Simulate 10ms API call

print(tracker.get_metrics())
```

#### 2. Throughput Monitoring
```python
import time
from collections import defaultdict, deque

class ThroughputMonitor:
    def __init__(self, window_seconds=60):
        self.window_seconds = window_seconds
        self.requests = deque()
        self.requests_by_endpoint = defaultdict(lambda: deque())
    
    def record_request(self, endpoint=None):
        now = time.time()
        self.requests.append(now)
        
        if endpoint:
            self.requests_by_endpoint[endpoint].append(now)
        
        # Clean old entries
        self._cleanup_old_entries()
    
    def _cleanup_old_entries(self):
        cutoff = time.time() - self.window_seconds
        
        # Clean overall requests
        while self.requests and self.requests[0] < cutoff:
            self.requests.popleft()
        
        # Clean per-endpoint requests
        for endpoint_queue in self.requests_by_endpoint.values():
            while endpoint_queue and endpoint_queue[0] < cutoff:
                endpoint_queue.popleft()
    
    def get_throughput(self, endpoint=None):
        self._cleanup_old_entries()
        
        if endpoint:
            return len(self.requests_by_endpoint[endpoint]) / self.window_seconds
        else:
            return len(self.requests) / self.window_seconds
    
    def get_all_throughputs(self):
        result = {'overall': self.get_throughput()}
        
        for endpoint in self.requests_by_endpoint:
            result[endpoint] = self.get_throughput(endpoint)
        
        return result

# Example usage
monitor = ThroughputMonitor(window_seconds=10)

# Simulate requests
import random
endpoints = ['/api/users', '/api/orders', '/api/products']

for _ in range(50):
    endpoint = random.choice(endpoints)
    monitor.record_request(endpoint)
    time.sleep(0.1)

print(monitor.get_all_throughputs())
```

---

## 🎯 Practice Problems {#practice}

### Problem 1: Design a Rate Limiter
```
📋 Requirements:
- Allow N requests per time window
- Support different rate limiting algorithms
- Handle distributed scenarios
- Return appropriate HTTP status codes

🎯 Algorithms to Implement:
1. Token Bucket
2. Sliding Window Log
3. Sliding Window Counter
4. Fixed Window Counter
```

### Problem 2: Design a Cache System
```
📋 Requirements:
- Support GET/PUT operations
- Implement LRU eviction policy
- Handle cache expiration
- Support distributed caching

🎯 Components to Design:
1. In-memory cache
2. Cache eviction policies
3. Distributed cache consistency
4. Cache warming strategies
```

### Problem 3: Design a Load Balancer
```
📋 Requirements:
- Distribute traffic across multiple servers
- Health checking
- Multiple balancing algorithms
- Handle server failures gracefully

🎯 Algorithms to Implement:
1. Round Robin
2. Weighted Round Robin
3. Least Connections
4. Consistent Hashing
```

---

## 🚀 Next Steps

1. **Study Advanced Topics**: Move to caching strategies and database design
2. **Practice System Design**: Use online platforms like Grokking System Design
3. **Build Projects**: Implement mini-versions of popular systems
4. **Mock Interviews**: Practice with peers or use interview platforms

---

## 📚 Additional Resources

### Books
- "Designing Data-Intensive Applications" by Martin Kleppmann
- "System Design Interview" by Alex Xu
- "Building Microservices" by Sam Newman

### Online Courses
- Grokking the System Design Interview
- MIT 6.824: Distributed Systems
- High Scalability Blog

### Practice Platforms
- LeetCode System Design
- Pramp System Design
- InterviewBit System Design

---

*🎯 Remember: System design is about trade-offs. There's no perfect solution, only solutions that fit specific requirements and constraints.*

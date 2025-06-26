# 🚀 Caching Strategies & Systems
*Master the art of high-performance data access*

## 📚 Table of Contents
1. [Caching Fundamentals](#fundamentals)
2. [Cache Patterns](#patterns)
3. [Cache Eviction Policies](#eviction)
4. [Distributed Caching](#distributed)
5. [Cache Implementation](#implementation)
6. [Real-World Examples](#examples)

---

## 🎯 Caching Fundamentals {#fundamentals}

### What is Caching?
Caching is a technique to store frequently accessed data in a fast storage layer to reduce latency and improve system performance.

### Cache Hierarchy
```
🔹 L1 Cache: CPU Cache (Nanoseconds)
🔹 L2 Cache: In-Memory Cache (Microseconds)
🔹 L3 Cache: Local Disk Cache (Milliseconds)
🔹 L4 Cache: Distributed Cache (Milliseconds)
🔹 L5 Cache: CDN Cache (Tens of milliseconds)
```

### Cache Performance Metrics
```python
class CacheMetrics:
    def __init__(self):
        self.hits = 0
        self.misses = 0
        self.total_requests = 0
        self.total_latency = 0
    
    def record_hit(self, latency_ms):
        self.hits += 1
        self.total_requests += 1
        self.total_latency += latency_ms
    
    def record_miss(self, latency_ms):
        self.misses += 1
        self.total_requests += 1
        self.total_latency += latency_ms
    
    def get_hit_ratio(self):
        if self.total_requests == 0:
            return 0
        return self.hits / self.total_requests
    
    def get_average_latency(self):
        if self.total_requests == 0:
            return 0
        return self.total_latency / self.total_requests
    
    def get_stats(self):
        return {
            'hit_ratio': self.get_hit_ratio(),
            'miss_ratio': 1 - self.get_hit_ratio(),
            'total_requests': self.total_requests,
            'average_latency_ms': self.get_average_latency()
        }

# Example usage
metrics = CacheMetrics()
metrics.record_hit(2)    # Cache hit with 2ms latency
metrics.record_miss(50)  # Cache miss with 50ms latency
print(metrics.get_stats())
```

---

## 🔄 Cache Patterns {#patterns}

### 1. Cache-Aside (Lazy Loading)
```python
import time
import json

class CacheAsidePattern:
    def __init__(self, cache, database):
        self.cache = cache
        self.database = database
    
    def get(self, key):
        # Try to get from cache first
        cached_value = self.cache.get(key)
        if cached_value is not None:
            print(f"Cache HIT for key: {key}")
            return json.loads(cached_value)
        
        # Cache miss - get from database
        print(f"Cache MISS for key: {key}")
        value = self.database.get(key)
        
        if value is not None:
            # Store in cache for future requests
            self.cache.set(key, json.dumps(value), ttl=300)  # 5 minutes TTL
        
        return value
    
    def update(self, key, value):
        # Update database first
        self.database.set(key, value)
        
        # Invalidate cache to maintain consistency
        self.cache.delete(key)

# Example usage
class SimpleCache:
    def __init__(self):
        self.data = {}
        self.expiry = {}
    
    def get(self, key):
        if key in self.expiry and time.time() > self.expiry[key]:
            del self.data[key]
            del self.expiry[key]
            return None
        return self.data.get(key)
    
    def set(self, key, value, ttl=None):
        self.data[key] = value
        if ttl:
            self.expiry[key] = time.time() + ttl
    
    def delete(self, key):
        self.data.pop(key, None)
        self.expiry.pop(key, None)

class SimpleDatabase:
    def __init__(self):
        self.data = {
            'user:1': {'name': 'Alice', 'email': 'alice@example.com'},
            'user:2': {'name': 'Bob', 'email': 'bob@example.com'}
        }
    
    def get(self, key):
        time.sleep(0.1)  # Simulate database latency
        return self.data.get(key)
    
    def set(self, key, value):
        time.sleep(0.1)  # Simulate database latency
        self.data[key] = value

# Demo
cache = SimpleCache()
db = SimpleDatabase()
cache_aside = CacheAsidePattern(cache, db)

# First access - cache miss
user = cache_aside.get('user:1')
print(f"User: {user}")

# Second access - cache hit
user = cache_aside.get('user:1')
print(f"User: {user}")
```

### 2. Write-Through Cache
```python
class WriteThroughCache:
    def __init__(self, cache, database):
        self.cache = cache
        self.database = database
    
    def get(self, key):
        # Try cache first
        cached_value = self.cache.get(key)
        if cached_value is not None:
            return json.loads(cached_value)
        
        # Fallback to database
        value = self.database.get(key)
        if value is not None:
            self.cache.set(key, json.dumps(value))
        
        return value
    
    def set(self, key, value):
        # Write to both cache and database synchronously
        self.database.set(key, value)
        self.cache.set(key, json.dumps(value))
        
    def delete(self, key):
        self.database.delete(key)
        self.cache.delete(key)

# Usage ensures data consistency but higher write latency
```

### 3. Write-Behind Cache (Write-Back)
```python
import threading
import queue
import time

class WriteBehindCache:
    def __init__(self, cache, database, flush_interval=5):
        self.cache = cache
        self.database = database
        self.write_queue = queue.Queue()
        self.flush_interval = flush_interval
        
        # Start background thread for flushing writes
        self.flush_thread = threading.Thread(target=self._flush_worker, daemon=True)
        self.flush_thread.start()
    
    def get(self, key):
        cached_value = self.cache.get(key)
        if cached_value is not None:
            return json.loads(cached_value)
        
        value = self.database.get(key)
        if value is not None:
            self.cache.set(key, json.dumps(value))
        
        return value
    
    def set(self, key, value):
        # Write to cache immediately
        self.cache.set(key, json.dumps(value))
        
        # Queue write to database for later
        self.write_queue.put(('SET', key, value))
    
    def delete(self, key):
        self.cache.delete(key)
        self.write_queue.put(('DELETE', key, None))
    
    def _flush_worker(self):
        """Background worker to flush writes to database"""
        pending_writes = {}
        
        while True:
            try:
                # Collect writes for batching
                while not self.write_queue.empty():
                    operation, key, value = self.write_queue.get(timeout=1)
                    pending_writes[key] = (operation, value)
                
                # Flush pending writes
                for key, (operation, value) in pending_writes.items():
                    if operation == 'SET':
                        self.database.set(key, value)
                    elif operation == 'DELETE':
                        self.database.delete(key)
                
                pending_writes.clear()
                time.sleep(self.flush_interval)
                
            except queue.Empty:
                continue
            except Exception as e:
                print(f"Error in flush worker: {e}")
```

### 4. Refresh-Ahead Cache
```python
import threading
import time

class RefreshAheadCache:
    def __init__(self, cache, database, refresh_threshold=0.8):
        self.cache = cache
        self.database = database
        self.refresh_threshold = refresh_threshold
        self.refresh_executor = threading.ThreadPoolExecutor(max_workers=5)
    
    def get(self, key):
        cached_item = self.cache.get_with_metadata(key)
        
        if cached_item is None:
            # Cache miss - synchronous load
            value = self.database.get(key)
            if value is not None:
                self.cache.set(key, json.dumps(value), ttl=300)
            return value
        
        value, created_time, ttl = cached_item
        
        # Check if refresh is needed
        age = time.time() - created_time
        if age > (ttl * self.refresh_threshold):
            # Asynchronously refresh the cache
            self.refresh_executor.submit(self._refresh_cache, key)
        
        return json.loads(value)
    
    def _refresh_cache(self, key):
        """Asynchronously refresh cache entry"""
        try:
            fresh_value = self.database.get(key)
            if fresh_value is not None:
                self.cache.set(key, json.dumps(fresh_value), ttl=300)
        except Exception as e:
            print(f"Error refreshing cache for key {key}: {e}")

class CacheWithMetadata:
    def __init__(self):
        self.data = {}
        self.metadata = {}
    
    def get_with_metadata(self, key):
        if key not in self.data:
            return None
        
        created_time, ttl = self.metadata[key]
        if time.time() > created_time + ttl:
            del self.data[key]
            del self.metadata[key]
            return None
        
        return self.data[key], created_time, ttl
    
    def set(self, key, value, ttl):
        self.data[key] = value
        self.metadata[key] = (time.time(), ttl)
```

---

## 🗑️ Cache Eviction Policies {#eviction}

### 1. LRU (Least Recently Used)
```python
from collections import OrderedDict
import threading

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()
        self.lock = threading.RLock()
    
    def get(self, key):
        with self.lock:
            if key not in self.cache:
                return None
            
            # Move to end (most recently used)
            value = self.cache.pop(key)
            self.cache[key] = value
            return value
    
    def set(self, key, value):
        with self.lock:
            if key in self.cache:
                # Update existing key
                self.cache.pop(key)
            elif len(self.cache) >= self.capacity:
                # Remove least recently used (first item)
                self.cache.popitem(last=False)
            
            # Add new item (most recently used)
            self.cache[key] = value
    
    def delete(self, key):
        with self.lock:
            self.cache.pop(key, None)
    
    def size(self):
        return len(self.cache)
    
    def clear(self):
        with self.lock:
            self.cache.clear()

# Example usage
lru = LRUCache(capacity=3)
lru.set('a', 1)
lru.set('b', 2)
lru.set('c', 3)
print(lru.get('a'))  # 1, 'a' becomes most recent
lru.set('d', 4)      # 'b' gets evicted (least recent)
print(lru.get('b'))  # None (evicted)
```

### 2. LFU (Least Frequently Used)
```python
from collections import defaultdict
import heapq
import time

class LFUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}
        self.frequencies = defaultdict(int)
        self.freq_to_keys = defaultdict(set)
        self.min_freq = 0
        self.time_counter = 0
        self.key_times = {}
    
    def get(self, key):
        if key not in self.cache:
            return None
        
        self._update_frequency(key)
        return self.cache[key]
    
    def set(self, key, value):
        if self.capacity <= 0:
            return
        
        if key in self.cache:
            self.cache[key] = value
            self._update_frequency(key)
        else:
            if len(self.cache) >= self.capacity:
                self._evict_lfu()
            
            self.cache[key] = value
            self.frequencies[key] = 1
            self.freq_to_keys[1].add(key)
            self.min_freq = 1
            self.time_counter += 1
            self.key_times[key] = self.time_counter
    
    def _update_frequency(self, key):
        freq = self.frequencies[key]
        self.freq_to_keys[freq].remove(key)
        
        if not self.freq_to_keys[freq] and freq == self.min_freq:
            self.min_freq += 1
        
        self.frequencies[key] += 1
        self.freq_to_keys[freq + 1].add(key)
        self.time_counter += 1
        self.key_times[key] = self.time_counter
    
    def _evict_lfu(self):
        # Find the least frequently used key
        # If tie, remove the oldest one
        lfu_keys = self.freq_to_keys[self.min_freq]
        oldest_key = min(lfu_keys, key=lambda k: self.key_times[k])
        
        lfu_keys.remove(oldest_key)
        del self.cache[oldest_key]
        del self.frequencies[oldest_key]
        del self.key_times[oldest_key]

# Example usage
lfu = LFUCache(capacity=2)
lfu.set('a', 1)
lfu.set('b', 2)
print(lfu.get('a'))  # 1, frequency of 'a' increases
lfu.set('c', 3)      # 'b' gets evicted (least frequent)
print(lfu.get('b'))  # None (evicted)
```

### 3. TTL (Time To Live) Cache
```python
import time
import threading
from typing import Optional, Any

class TTLCache:
    def __init__(self, default_ttl=300):
        self.default_ttl = default_ttl
        self.cache = {}
        self.expiry_times = {}
        self.lock = threading.RLock()
        
        # Start cleanup thread
        self.cleanup_thread = threading.Thread(target=self._cleanup_expired, daemon=True)
        self.cleanup_thread.start()
    
    def get(self, key) -> Optional[Any]:
        with self.lock:
            if key not in self.cache:
                return None
            
            if time.time() > self.expiry_times[key]:
                # Item expired
                del self.cache[key]
                del self.expiry_times[key]
                return None
            
            return self.cache[key]
    
    def set(self, key, value, ttl=None):
        with self.lock:
            if ttl is None:
                ttl = self.default_ttl
            
            self.cache[key] = value
            self.expiry_times[key] = time.time() + ttl
    
    def delete(self, key):
        with self.lock:
            self.cache.pop(key, None)
            self.expiry_times.pop(key, None)
    
    def _cleanup_expired(self):
        """Background thread to clean up expired entries"""
        while True:
            try:
                current_time = time.time()
                with self.lock:
                    expired_keys = [
                        key for key, expiry in self.expiry_times.items()
                        if current_time > expiry
                    ]
                    
                    for key in expired_keys:
                        del self.cache[key]
                        del self.expiry_times[key]
                
                time.sleep(60)  # Check every minute
            except Exception as e:
                print(f"Error in TTL cleanup: {e}")

# Example usage
ttl_cache = TTLCache(default_ttl=10)  # 10 seconds default TTL
ttl_cache.set('temp_data', {'value': 123}, ttl=5)  # 5 seconds TTL
print(ttl_cache.get('temp_data'))  # {'value': 123}
time.sleep(6)
print(ttl_cache.get('temp_data'))  # None (expired)
```

---

## 🌐 Distributed Caching {#distributed}

### 1. Consistent Hashing for Cache Distribution
```python
import hashlib
import bisect
from typing import List, Dict, Optional

class ConsistentHashRing:
    def __init__(self, nodes: List[str], virtual_nodes: int = 150):
        self.virtual_nodes = virtual_nodes
        self.ring = {}
        self.sorted_keys = []
        
        for node in nodes:
            self.add_node(node)
    
    def _hash(self, key: str) -> int:
        return int(hashlib.md5(key.encode()).hexdigest(), 16)
    
    def add_node(self, node: str):
        for i in range(self.virtual_nodes):
            virtual_key = f"{node}:{i}"
            hash_value = self._hash(virtual_key)
            self.ring[hash_value] = node
            bisect.insort(self.sorted_keys, hash_value)
    
    def remove_node(self, node: str):
        for i in range(self.virtual_nodes):
            virtual_key = f"{node}:{i}"
            hash_value = self._hash(virtual_key)
            if hash_value in self.ring:
                del self.ring[hash_value]
                self.sorted_keys.remove(hash_value)
    
    def get_node(self, key: str) -> Optional[str]:
        if not self.ring:
            return None
        
        hash_value = self._hash(key)
        
        # Find the first node with hash >= key's hash
        idx = bisect.bisect_right(self.sorted_keys, hash_value)
        
        # Wrap around if necessary
        if idx == len(self.sorted_keys):
            idx = 0
        
        return self.ring[self.sorted_keys[idx]]

class DistributedCache:
    def __init__(self, cache_nodes: Dict[str, 'CacheNode']):
        self.cache_nodes = cache_nodes
        self.hash_ring = ConsistentHashRing(list(cache_nodes.keys()))
    
    def get(self, key: str):
        node_id = self.hash_ring.get_node(key)
        if node_id and node_id in self.cache_nodes:
            return self.cache_nodes[node_id].get(key)
        return None
    
    def set(self, key: str, value, ttl=None):
        node_id = self.hash_ring.get_node(key)
        if node_id and node_id in self.cache_nodes:
            self.cache_nodes[node_id].set(key, value, ttl)
    
    def delete(self, key: str):
        node_id = self.hash_ring.get_node(key)
        if node_id and node_id in self.cache_nodes:
            self.cache_nodes[node_id].delete(key)
    
    def add_node(self, node_id: str, cache_node: 'CacheNode'):
        self.cache_nodes[node_id] = cache_node
        self.hash_ring.add_node(node_id)
    
    def remove_node(self, node_id: str):
        if node_id in self.cache_nodes:
            del self.cache_nodes[node_id]
            self.hash_ring.remove_node(node_id)

class CacheNode:
    def __init__(self, node_id: str):
        self.node_id = node_id
        self.cache = TTLCache()
    
    def get(self, key: str):
        return self.cache.get(key)
    
    def set(self, key: str, value, ttl=None):
        self.cache.set(key, value, ttl)
    
    def delete(self, key: str):
        self.cache.delete(key)

# Example usage
nodes = {
    'cache1': CacheNode('cache1'),
    'cache2': CacheNode('cache2'),
    'cache3': CacheNode('cache3')
}

distributed_cache = DistributedCache(nodes)
distributed_cache.set('user:1', {'name': 'Alice'})
distributed_cache.set('user:2', {'name': 'Bob'})

print(distributed_cache.get('user:1'))  # Gets from appropriate node
```

### 2. Cache Replication Strategy
```python
import threading
import random
from typing import Set

class ReplicatedCache:
    def __init__(self, primary_cache: CacheNode, replica_caches: List[CacheNode], 
                 replication_factor: int = 2):
        self.primary_cache = primary_cache
        self.replica_caches = replica_caches
        self.replication_factor = min(replication_factor, len(replica_caches))
        self.executor = threading.ThreadPoolExecutor(max_workers=10)
    
    def get(self, key: str):
        # Try primary first
        value = self.primary_cache.get(key)
        if value is not None:
            return value
        
        # Fallback to replicas
        for replica in self.replica_caches:
            value = replica.get(key)
            if value is not None:
                # Repair primary cache
                self.primary_cache.set(key, value)
                return value
        
        return None
    
    def set(self, key: str, value, ttl=None):
        # Write to primary synchronously
        self.primary_cache.set(key, value, ttl)
        
        # Replicate to selected replicas asynchronously
        selected_replicas = random.sample(
            self.replica_caches, 
            min(self.replication_factor, len(self.replica_caches))
        )
        
        for replica in selected_replicas:
            self.executor.submit(replica.set, key, value, ttl)
    
    def delete(self, key: str):
        # Delete from primary
        self.primary_cache.delete(key)
        
        # Delete from all replicas asynchronously
        for replica in self.replica_caches:
            self.executor.submit(replica.delete, key)

# Example usage
primary = CacheNode('primary')
replicas = [CacheNode(f'replica_{i}') for i in range(3)]
replicated_cache = ReplicatedCache(primary, replicas, replication_factor=2)

replicated_cache.set('important_data', {'value': 'critical'})
print(replicated_cache.get('important_data'))
```

---

## 🛠️ Cache Implementation Examples {#implementation}

### Multi-Level Cache System
```python
class MultiLevelCache:
    def __init__(self):
        self.l1_cache = LRUCache(capacity=100)      # Fast, small
        self.l2_cache = LRUCache(capacity=1000)     # Medium, larger
        self.l3_cache = TTLCache(default_ttl=3600)  # Slow, persistent
    
    def get(self, key):
        # Try L1 first (fastest)
        value = self.l1_cache.get(key)
        if value is not None:
            return value
        
        # Try L2
        value = self.l2_cache.get(key)
        if value is not None:
            # Promote to L1
            self.l1_cache.set(key, value)
            return value
        
        # Try L3
        value = self.l3_cache.get(key)
        if value is not None:
            # Promote to L2 and L1
            self.l2_cache.set(key, value)
            self.l1_cache.set(key, value)
            return value
        
        return None
    
    def set(self, key, value, ttl=None):
        # Write to all levels
        self.l1_cache.set(key, value)
        self.l2_cache.set(key, value)
        self.l3_cache.set(key, value, ttl)
    
    def delete(self, key):
        # Delete from all levels
        self.l1_cache.delete(key)
        self.l2_cache.delete(key)
        self.l3_cache.delete(key)

# Example usage
multilevel_cache = MultiLevelCache()
multilevel_cache.set('hot_data', {'value': 123})
print(multilevel_cache.get('hot_data'))  # Fast L1 access
```

---

## 🌍 Real-World Cache Examples {#examples}

### 1. Web Application Cache
```python
class WebAppCache:
    def __init__(self):
        self.session_cache = TTLCache(default_ttl=1800)      # 30 minutes
        self.page_cache = LRUCache(capacity=1000)            # Page content
        self.api_response_cache = TTLCache(default_ttl=300)   # 5 minutes
        self.user_profile_cache = LRUCache(capacity=10000)   # User data
    
    def cache_user_session(self, session_id: str, user_data: dict):
        self.session_cache.set(session_id, user_data, ttl=1800)
    
    def get_user_session(self, session_id: str):
        return self.session_cache.get(session_id)
    
    def cache_page_content(self, url: str, content: str):
        self.page_cache.set(url, content)
    
    def get_cached_page(self, url: str):
        return self.page_cache.get(url)
    
    def cache_api_response(self, endpoint: str, params: dict, response: dict):
        cache_key = f"{endpoint}:{hash(str(sorted(params.items())))}"
        self.api_response_cache.set(cache_key, response, ttl=300)
    
    def get_cached_api_response(self, endpoint: str, params: dict):
        cache_key = f"{endpoint}:{hash(str(sorted(params.items())))}"
        return self.api_response_cache.get(cache_key)

# Usage in web framework
web_cache = WebAppCache()

# Cache user session
web_cache.cache_user_session('sess_123', {'user_id': 1, 'username': 'alice'})

# Cache API response
web_cache.cache_api_response('/api/users', {'page': 1}, {'users': [...], 'total': 100})
```

### 2. Database Query Cache
```python
import hashlib
import json

class DatabaseQueryCache:
    def __init__(self, database):
        self.database = database
        self.query_cache = LRUCache(capacity=1000)
        self.table_dependencies = defaultdict(set)
    
    def execute_query(self, sql: str, params: tuple = (), cache_ttl: int = 300):
        # Generate cache key
        cache_key = self._generate_cache_key(sql, params)
        
        # Try cache first
        cached_result = self.query_cache.get(cache_key)
        if cached_result is not None:
            return cached_result
        
        # Execute query
        result = self.database.execute(sql, params)
        
        # Cache result with table dependencies
        tables = self._extract_tables_from_query(sql)
        self.query_cache.set(cache_key, result)
        
        for table in tables:
            self.table_dependencies[table].add(cache_key)
        
        return result
    
    def invalidate_table_cache(self, table_name: str):
        """Invalidate all cached queries involving this table"""
        if table_name in self.table_dependencies:
            for cache_key in self.table_dependencies[table_name]:
                self.query_cache.delete(cache_key)
            del self.table_dependencies[table_name]
    
    def _generate_cache_key(self, sql: str, params: tuple) -> str:
        query_string = f"{sql}:{str(params)}"
        return hashlib.sha256(query_string.encode()).hexdigest()
    
    def _extract_tables_from_query(self, sql: str) -> set:
        # Simplified table extraction (in reality, use SQL parser)
        import re
        tables = set()
        
        # Match FROM and JOIN clauses
        patterns = [
            r'FROM\s+(\w+)',
            r'JOIN\s+(\w+)',
            r'UPDATE\s+(\w+)',
            r'INSERT\s+INTO\s+(\w+)',
            r'DELETE\s+FROM\s+(\w+)'
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, sql.upper())
            for match in matches:
                tables.add(match.group(1).lower())
        
        return tables

# Example usage
class MockDatabase:
    def execute(self, sql, params):
        # Simulate database query
        time.sleep(0.1)  # Database latency
        return [{'id': 1, 'name': 'Alice'}, {'id': 2, 'name': 'Bob'}]

db = MockDatabase()
cached_db = DatabaseQueryCache(db)

# First query - cache miss
result1 = cached_db.execute_query("SELECT * FROM users WHERE active = ?", (True,))
print(f"First query: {result1}")

# Second query - cache hit
result2 = cached_db.execute_query("SELECT * FROM users WHERE active = ?", (True,))
print(f"Second query: {result2}")

# Invalidate cache when users table is updated
cached_db.invalidate_table_cache('users')
```

---

## 🎯 Cache Design Considerations

### When to Use Different Cache Patterns
```
🔹 Cache-Aside: 
   - Read-heavy workloads
   - Complex queries
   - Need fine-grained control

🔹 Write-Through:
   - Write-heavy workloads
   - Need strong consistency
   - Can tolerate write latency

🔹 Write-Behind:
   - High write throughput
   - Can tolerate data loss risk
   - Batch processing beneficial

🔹 Refresh-Ahead:
   - Predictable access patterns
   - Cannot tolerate cache misses
   - Fresh data is critical
```

### Cache Sizing Guidelines
```python
def estimate_cache_size(avg_item_size_bytes: int, hit_ratio_target: float, 
                       requests_per_second: int, dataset_size_gb: float) -> dict:
    """
    Estimate optimal cache size based on workload characteristics
    """
    # Working set estimation (80/20 rule)
    working_set_ratio = 0.2
    working_set_gb = dataset_size_gb * working_set_ratio
    
    # Cache size for target hit ratio
    cache_size_gb = working_set_gb * hit_ratio_target
    
    # Memory requirements
    overhead_factor = 1.5  # Account for cache overhead
    total_memory_gb = cache_size_gb * overhead_factor
    
    return {
        'recommended_cache_size_gb': cache_size_gb,
        'total_memory_needed_gb': total_memory_gb,
        'estimated_items': int((cache_size_gb * 1024**3) / avg_item_size_bytes),
        'working_set_gb': working_set_gb
    }

# Example calculation
cache_estimate = estimate_cache_size(
    avg_item_size_bytes=1024,    # 1KB average item
    hit_ratio_target=0.95,       # 95% cache hit rate
    requests_per_second=1000,    # 1K RPS
    dataset_size_gb=100          # 100GB total dataset
)

print(json.dumps(cache_estimate, indent=2))
```

---

## 🚀 Next Steps

1. **Study Database Design**: Learn about indexing and query optimization
2. **Explore CDNs**: Understand global content distribution
3. **Practice Cache Problems**: Implement LRU, LFU, and distributed caches
4. **Monitor Cache Performance**: Learn about cache metrics and optimization

---

*🎯 Remember: The best cache is one that's invisible to users but dramatically improves their experience. Choose the right pattern for your specific use case and always measure performance impact.*

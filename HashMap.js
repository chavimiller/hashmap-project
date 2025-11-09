export class HashMap {
  constructor(loadFactor = 0.75, capacity = 16) {
    this.loadFactor = loadFactor;
    this.capacity = capacity;
    this.size = 0;
    this.buckets = Array.from({ length: capacity }, () => []);
  }

  hash(key) {
    let hashCode = 0;
    const keyToStr = key.toString();

    const primeNumber = 31;
    for (let i = 0; i < keyToStr.length; i++) {
      hashCode = primeNumber * hashCode + keyToStr.charCodeAt(i);
      hashCode = hashCode % this.capacity;
    }

    return hashCode;
  }

  set(key, value) {
    const bucketIndex = this.hash(key);
    if (bucketIndex < 0 || bucketIndex >= this.buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }
    const bucket = this.buckets[bucketIndex];

    for (let index of bucket) {
      if (index.key === key) {
        index.value = value;
        return;
      }
    }
    bucket.push({ key, value });
    this.size++;

    let growNumber = this.loadFactor * this.capacity;
    if (this.size > growNumber) {
      this.resize();
    }
  }

  get(key) {
    const bucketIndex = this.hash(key);
    if (bucketIndex < 0 || bucketIndex >= this.buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }
    const bucket = this.buckets[bucketIndex];
    for (let index of bucket) {
      if (index.key === key) {
        return index.value;
      }
    }
    return null;
  }

  has(key) {
    const bucketIndex = this.hash(key);
    if (bucketIndex < 0 || bucketIndex >= this.buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }
    const bucket = this.buckets[bucketIndex];
    for (let index of bucket) {
      if (index.key === key) {
        return true;
      }
    }
    return false;
  }

  remove(key) {
    const bucketIndex = this.hash(key);
    if (bucketIndex < 0 || bucketIndex >= this.buckets.length) {
      throw new Error("Trying to access index out of bounds");
    }
    const bucket = this.buckets[bucketIndex];
    if (bucket) {
      for (let i = 0; i < bucket.length; i++) {
        if (bucket[i].key === key) {
          bucket.splice(i, 1);
          this.size--;
          return true;
        }
      }
    }
    return false;
  }

  length() {
    return this.size;
  }

  clear() {
    this.buckets = Array.from({ length: this.capacity }, () => []);
    this.size = 0;
  }

  keys() {
    const bucketsArray = this.buckets;
    const keysArray = [];
    for (const bucket of bucketsArray) {
      if (bucket) {
        for (const pairing of bucket) {
          keysArray.push(pairing.key);
        }
      }
    }
    return keysArray;
  }

  values() {
    const bucketsArray = this.buckets;
    const valuesArray = [];
    for (const bucket of bucketsArray) {
      if (bucket) {
        for (const pairing of bucket) {
          valuesArray.push(pairing.value);
        }
      }
    }
    return valuesArray;
  }

  entries() {
    const bucketsArray = this.buckets;
    const entriesArray = [];
    for (const bucket of bucketsArray) {
      if (bucket) {
        for (const pairing of bucket) {
          entriesArray.push([pairing.key, pairing.value]);
        }
      }
    }
    return entriesArray;
  }

  resize() {
    const oldBuckets = this.buckets;
    this.capacity *= 2;
    this.buckets = Array.from({ length: this.capacity }, () => []);
    this.size = 0;

    for (const bucket of oldBuckets) {
      for (const entry of bucket) {
        this.set(entry.key, entry.value);
      }
    }
  }
}

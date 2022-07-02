# SLSC
#### Small Local Storage Cache
small library to store cache data in localstorage with auto remove (ttl)<br><br>

#### using example

import the SLSCache library
```js
import SLSCache from 'sls-cache'
```

config default values of the TTL and the cache tag name
```js
SLSCache.config({ cacheName: 'slscache', defaultTTL: 10 });
```

| Config      | Type        | Default    |
| :---------- | :---------- | :--------- |
| cacheName   | string      | slscache   |
| TTL         | number      | 60 minutes |

<br>

``` js
SLSCache.set('use unique key', 'data of any type', 6);
SLSCache.set('use unique key', 'data of any type without specific TTL');

SLSCache.get('unique key');
```

<br>

##### supporting typescript

```ts
interface Interface {
  val: string;
}

const obj: Interface = { val: 'my value' };
SLSCache.set('obj', obj);

const data = SLSCache.get<Interface>('obj');
console.log(data?.val);
```

<br>

| Methods     | args             |
| :---------- | :--------------- |
| set         | (key, data, ttl) |
| get         | key              |

<br>
<br>
<br>

[Source Code In GitHub](https:github.com/karamjb/SLSC)
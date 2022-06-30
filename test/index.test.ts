import SLSCache from '../index';

const cacheName = "name";
const item = { key: "hello", data: "any data" };
describe('test write to localStorage', () => {

  it('store item', () => {
    SLSCache.config({ defaultTTL: 10, cacheName });
    SLSCache.set<string>(item.key, item.data, 1 / 60);

    expect(SLSCache.get(item.key)).toBe(item.data);
  });

  it("expiry item", async () => {
    await new Promise((r) => setTimeout(r, 2000));
    expect(SLSCache.get(item.key)).toBe(undefined);
  });

  it("rest when cache not valid", () => {
    SLSCache.set<string>(item.key, item.data, 60);
    localStorage.setItem(cacheName, "not valid json :{");
    expect(SLSCache.get(item.key)).toBe(undefined);
  });
});
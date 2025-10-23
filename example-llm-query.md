# Example LLM Query Workflow

## User Query:
"Compare yesterday's referral traffic to an average of the last four similar days of weeks by referral bucket, add together other/aggregators/ai together into one bucket before making the calc, add % change the # change"

## How the LLM would use the MCP tools:

### Step 1: Get yesterday's data by referrer type

```javascript
// Call get_referrers 4 times for yesterday (2025-10-22)
get_referrers({
  type: "social",
  period_start: "2025-10-22",
  period_end: "2025-10-22",
  limit: 100
})
// Result: 188,450 hits

get_referrers({
  type: "search",
  period_start: "2025-10-22",
  period_end: "2025-10-22",
  limit: 100
})
// Result: 81,847 hits

get_referrers({
  type: "other",
  period_start: "2025-10-22",
  period_end: "2025-10-22",
  limit: 100
})
// Result: 13,846 hits

get_referrers({
  type: "internal",
  period_start: "2025-10-22",
  period_end: "2025-10-22",
  limit: 100
})
// Result: 477,818 hits
```

### Step 2: Get the last 4 similar days (same day of week - Tuesdays)

```javascript
// For each of the last 4 Tuesdays: Oct 15, Oct 8, Oct 1, Sep 24
// Call get_referrers 4 times per day = 16 total calls

// Example for Oct 15:
get_referrers({
  type: "social",
  period_start: "2025-10-15",
  period_end: "2025-10-15",
  limit: 100
})
// ... repeat for search, other, internal
// ... repeat for Oct 8, Oct 1, Sep 24
```

### Step 3: Aggregate and calculate

LLM would then:
1. **Combine buckets**: Add "other" + "internal" into one "Other/Internal" bucket
2. **Calculate averages** for the 4 previous Tuesdays
3. **Compare** yesterday vs average:
   - Social: 188,450 vs [avg] = X% change
   - Search: 81,847 vs [avg] = Y% change
   - Other/Internal: (13,846 + 477,818) vs [avg] = Z% change

### Step 4: Format results

```
Referral Traffic Comparison - Oct 22 vs Previous 4 Tuesdays

| Bucket          | Yesterday | 4-Day Avg | Change    | % Change |
|-----------------|-----------|-----------|-----------|----------|
| Social          | 188,450   | [avg]     | [diff]    | [%]      |
| Search          | 81,847    | [avg]     | [diff]    | [%]      |
| Other/Internal  | 491,664   | [avg]     | [diff]    | [%]      |
```

## ✅ Capabilities Verified

The MCP server now supports:
- ✅ Specific single-day queries (period_start = period_end)
- ✅ All 4 referrer types (social, search, other, internal)
- ✅ Date-based comparisons (not just "last 7 days")
- ✅ Sufficient data for LLM to aggregate buckets
- ✅ Sufficient data for percentage calculations

The LLM can make ~20 API calls to fully answer this query:
- 4 calls for yesterday
- 16 calls for 4 previous similar days

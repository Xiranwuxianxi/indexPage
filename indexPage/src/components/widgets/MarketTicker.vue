<script setup>
// 市场指数条：上证指数 / 纳斯达克 / 标普 500（后端代理腾讯行情，真实数据）
defineProps({
  markets: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

function fmt(n) {
  return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<template>
  <div class="market-wrap">
    <p class="market-live">
      <span class="live-dot" aria-hidden="true" />实时行情 · 每 3 秒自动刷新
    </p>
    <div class="market-strip" aria-label="市场指数">
      <div v-if="loading || !markets.length" class="market-skeleton" />
      <template v-else>
        <div v-for="m in markets" :key="m.code" class="market-item">
          <div class="market-head">
            <span class="market-name">{{ m.name }}</span>
            <span class="market-code">{{ m.code }}</span>
          </div>
          <span class="market-price">{{ m.price ? fmt(m.price) : '—' }}</span>
          <span class="market-change" :class="m.change > 0 ? 'up' : m.change < 0 ? 'down' : ''">
            {{ m.change > 0 ? '+' : '' }}{{ fmt(m.change) }}
            （{{ m.changePct > 0 ? '+' : '' }}{{ m.changePct }}%）
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.market-live {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #e11d48;
  animation: live-pulse 1.2s ease-in-out infinite;
}

@keyframes live-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.8);
  }
}

.market-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.market-item {
  display: grid;
  gap: 6px;
  padding: 18px 20px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--paper);
}

.market-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.market-name {
  font-size: 0.98rem;
  font-weight: 950;
}

.market-code {
  color: var(--muted);
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.74rem;
}

.market-price {
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 1.5rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.market-change {
  font-size: 0.86rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

/* A 股习惯：红涨绿跌 */
.market-change.up {
  color: #e11d48;
}

.market-change.down {
  color: #059669;
}

.market-skeleton {
  grid-column: 1 / -1;
  min-height: 96px;
  border-radius: 16px;
  background: rgba(var(--brand-rgb), 0.06);
  animation: market-pulse 1.5s ease-in-out infinite;
}

@keyframes market-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}

@media (max-width: 640px) {
  .market-strip {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup>
import { storeToRefs } from 'pinia'

import { useSiteStore } from '../stores/site'

const site = useSiteStore()
const { focusAreas, timeline } = storeToRefs(site)
</script>

<template>
  <main class="page-view">
    <section class="content-panel" aria-labelledby="about-title">
      <div class="page-heading">
        <div>
          <p class="eyebrow">ABOUT THE LAB</p>
          <h1 id="about-title">关于这个空间</h1>
          <p class="page-lead">
            它不是传统意义上的作品集，更像一个持续扩展的数字工作台：把能运行的工具、能复盘的文章和能追踪的代码放在一起。
          </p>
        </div>
      </div>

      <div class="about-layout">
        <article class="about-panel">
          <h2>探索底层逻辑，用代码重构世界。</h2>
          <p>
            我喜欢从“为什么这样工作”开始拆问题，再把答案变成可运行、可验证、可分享的东西。这个主页会继续往工具集、实验模块和技术笔记方向生长。
          </p>
          <div class="panel-actions">
            <a
              class="action primary"
              href="https://gitee.com/litinyana"
              target="_blank"
              rel="noreferrer"
            >
              查看开源主页
            </a>
            <a
              class="action secondary"
              href="http://halo.xiranya.cn/"
              target="_blank"
              rel="noreferrer"
            >
              阅读博客
            </a>
          </div>
        </article>

        <div class="timeline" aria-label="建设节奏">
          <div v-for="item in timeline" :key="item.label" class="timeline-item">
            <strong>{{ item.label }}</strong>
            <span>{{ item.text }}</span>
          </div>
        </div>
      </div>

      <section class="insight-grid" aria-label="技术方向">
        <article v-for="area in focusAreas" :key="area.title" class="insight-card">
          <h3>{{ area.title }}</h3>
          <ul>
            <li v-for="item in area.items" :key="item">{{ item }}</li>
          </ul>
        </article>
      </section>
    </section>
  </main>
</template>

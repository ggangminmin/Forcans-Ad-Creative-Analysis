# 📊 Forcans Ad Creative Analysis & System
> **G-Stack 기반 광고 소재 최적화 및 자동 제안 시스템 (Agentic PoE)**

![Ad Creative Banner](https://img.shields.io/badge/AI_Agent-Ad_Optimization-orange?style=for-the-badge&logo=openai)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Agentic Workflow](https://img.shields.io/badge/Stack-G--Stack-blue?style=for-the-badge&logo=ai-agent)

---

## 📽 프로젝트 개요 (Overview)
**Forcans Ad Creative System**은 퍼포먼스 마케팅 단계에서 발생하는 '광고 소재 피로도' 문제를 해결하기 위해 설계된 **지능형 멀티 에이전트 시스템**입니다. 

단순한 생성 AI를 넘어, 시장 트렌드 분석부터 시각화 전략까지 각 단계별 전문 에이전트가 협업하는 **G-Stack 아키텍처**를 채택하여 광고 제작 효율을 **70% 이상** 개선합니다.

---

## 🧠 G-Stack & 서브 에이전트 아키텍처 (Agentic Workflow)

본 프로젝트는 3단계의 전문 서브 에이전트로 구성된 **G-Stack**을 통해 정교한 광고 기획 파이프라인을 구축했습니다.

### 1단계: 🕵️ Scouter Agent (시장 분석)
- **핵심 기술**: Tavily 실시간 검색 API + GPT-4o
- **역할**: 입력된 카테고리에 대한 최신 시장 트렌드, 경쟁사 광고 소구점, 소비자 피로도가 높은 문구(Skip trigger)를 실시간으로 스캔하여 기획의 기초 데이터를 생성합니다.

### 2단계: ✍️ Writer Agent (내러티브 설계)
- **핵심 기술**: 프롬프트 체이닝 + CTR 시뮬레이션 로직
- **역할**: Scouter가 수집한 데이터를 기반으로 소구점 중심의 카피 12안을 생성합니다. 특히 타겟의 성별/연령 데이터를 학습하여 예상 클릭률(CTR)을 데이터 시각화 형태로 미리 보여줍니다.

### 3단계: 🎨 Designer Agent (비주얼 디렉팅)
- **핵심 기술**: 9컷 스토리보드 생성 + 실시간 이미지 피드백 루프
- **역할**: 선정된 카피에 가장 적합한 9컷 분량의 비주얼 스토리보드를 설계합니다. 각 컷마다 구체적인 연출 가이드와 이미지 생성 프롬프트를 구성하며, 기획자의 피드백을 실시간으로 반영하여 즉시 수정 가능한 워크플로우를 제공합니다.

---

## 🔍 주요 성과 (Case Study)

- **문제 정의**: 고비용/저효율의 수동 광고 소재 제작 프로세스와 CTR 하락 문제.
- **AI 적용 근거**: 데이터 기반의 Scouter 분석과 서브 에이전트 간의 협업으로 의사결정 속도 및 창의성 극대화.
- **결과 지표**: 전체 광고 기획 및 시안 제작 준비 시간 **70% 절감**, 데이터 기반 소구점 적중률 향상.

---

## 📸 주요 실행 화면 (Screenshots)

<p align="center">
  <img src="https://raw.githubusercontent.com/ggangminmin/Forcans-Ad-Creative-Analysis/main/docs/ad_1.png" width="45%" alt="Scouter Stage" />
  <img src="https://raw.githubusercontent.com/ggangminmin/Forcans-Ad-Creative-Analysis/main/docs/ad_2.png" width="45%" alt="Analysis Detail" />
</p>
<p align="center">
  <img src="https://raw.githubusercontent.com/ggangminmin/Forcans-Ad-Creative-Analysis/main/docs/ad_4.png" width="45%" alt="Writer Stage & Simulation" />
  <img src="https://raw.githubusercontent.com/ggangminmin/Forcans-Ad-Creative-Analysis/main/docs/ad_3.png" width="45%" alt="Designer Stage & Visuals" />
</p>

---

## 🛠 기술 스택 (Tech Stack)

- **Framework**: Next.js 14 (App Router), TypeScript
- **Agent Orchestration**: **G-Stack** (Multi-agent Route Handlers)
- **Search Engine**: Tavily Search AI
- **LLM**: OpenAI GPT-4o, Claude 3.5 Sonnet
- **Styling**: Tailwind CSS, Framer Motion
- **Management**: Markdown-based Prompt Engineering (`.agents/`)

---

## 📄 라이선스 (License)
본 프로젝트는 개인 포트폴리오 및 AI 서비스 PoC 목적으로 제작되었습니다.

---
**Contact:** [강민석 (ggangminmin)](https://github.com/ggangminmin)

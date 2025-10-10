<template>
  <svg
    height="1em"
    viewBox="0 0 24 24"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="none"
      stroke="currentColor"
      stroke-dasharray="16"
      stroke-dashoffset="16"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    >
      <path class="menu-line" d="M5 5h14" />
      <path class="menu-line" d="M5 12h14" style="--delay: 0.2s" />
      <path class="menu-line" d="M5 19h14" style="--delay: 0.4s" />
    </g>
  </svg>
</template>

<style>
.menu-line {
  animation: menu-line 0.2s ease forwards;
  animation-delay: var(--delay, 0);
}

@keyframes menu-line {
  from {
    stroke-dashoffset: 16;
  }

  to {
    stroke-dashoffset: 0;
  }
}
</style>

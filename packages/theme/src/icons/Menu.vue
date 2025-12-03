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
  --m-value: 16;
  --value-from: 16;
  --value-to: 0;
  stroke-dashoffset: var(--m-value);
  animation: motion-value 0.2s ease forwards;
  animation-delay: var(--delay, 0);
}
</style>

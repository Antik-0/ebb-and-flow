<template>
  <svg
    class="sun"
    height="1em"
    viewBox="0 0 24 24"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    >
      <path
        class="sun-light"
        d="M12 21v1M21 12h1M12 3v-1M3 12h-1"
        stroke-dasharray="2"
        stroke-dashoffset="2"
        style="--delay: 0.6s"
      />
      <path
        class="sun-light"
        d="M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"
        stroke-dasharray="2"
        stroke-dashoffset="2"
        style="--delay: 0.8s"
      />
    </g>
    <mask id="SVGu6kfobeu">
      <circle
        cx="12"
        cy="12"
        fill="#fff"
        r="12"
      />
      <circle
        cx="18"
        cy="6"
        fill="#fff"
        r="12"
      >
        <animate
          attributeName="cx"
          dur="0.4s"
          fill="freeze"
          values="18;22"
        />
        <animate
          attributeName="cy"
          dur="0.4s"
          fill="freeze"
          values="6;2"
        />
        <animate
          attributeName="r"
          dur="0.4s"
          fill="freeze"
          values="12;3"
        />
      </circle>
      <circle cx="18" cy="6" r="10">
        <animate
          attributeName="cx"
          dur="0.4s"
          fill="freeze"
          values="18;22"
        />
        <animate
          attributeName="cy"
          dur="0.4s"
          fill="freeze"
          values="6;2"
        />
        <animate
          attributeName="r"
          dur="0.4s"
          fill="freeze"
          values="10;1"
        />
      </circle>
    </mask>
    <circle
      class="sun-body"
      cx="12"
      cy="12"
      fill="currentColor"
      mask="url(#SVGu6kfobeu)"
      r="10"
    />
  </svg>
</template>

<style>
.sun {
  animation: sun-rotate 10s linear 0.2s infinite;
}

.sun-body {
  animation: sun-body 0.4s ease forwards;
}

.sun-light {
  animation: sun-light 0.2s ease forwards;
  animation-delay: var(--delay);
}

@keyframes sun-body {
  from {
    r: 10
  }

  to {
    r: 6
  }
}

@keyframes sun-light {
  from {
    stroke-dashoffset: 2;
  }

  to {
    stroke-dashoffset: 0;
  }
}

@keyframes sun-rotate {
  to {
    rotate: 1turn;
  }
}
</style>

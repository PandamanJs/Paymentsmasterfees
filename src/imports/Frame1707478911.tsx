import svgPaths from "./svg-z5kx6dyu55";

function Frame() {
  return (
    <div className="relative shrink-0 size-[30px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <g id="Frame 1707478908">
          <rect fill="var(--fill-0, white)" height="29" rx="7.5" width="29" x="0.5" y="0.5" />
          <rect height="29" rx="7.5" stroke="var(--stroke-0, #D9D9D9)" width="29" x="0.5" y="0.5" />
          <path d={svgPaths.p4ee5080} fill="var(--fill-0, #FF0000)" id="path2" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0 size-[30px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <g id="Frame 1707478910">
          <rect fill="var(--fill-0, white)" height="29" rx="7.5" width="29" x="0.5" y="0.5" />
          <rect height="29" rx="7.5" stroke="var(--stroke-0, #D9D9D9)" width="29" x="0.5" y="0.5" />
          <path d={svgPaths.pec23280} fill="var(--fill-0, #02A024)" id="path3" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 size-[30px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <g id="Frame 1707478909">
          <rect fill="var(--fill-0, white)" height="29" rx="7.5" width="29" x="0.5" y="0.5" />
          <rect height="29" rx="7.5" stroke="var(--stroke-0, #D9D9D9)" width="29" x="0.5" y="0.5" />
          <path d={svgPaths.p116ac00} fill="var(--fill-0, black)" id="path1" />
        </g>
      </svg>
    </div>
  );
}

export default function Frame3() {
  return (
    <div className="relative size-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[4px] items-center p-[10px] relative size-full">
          <Frame />
          <Frame2 />
          <Frame1 />
        </div>
      </div>
    </div>
  );
}
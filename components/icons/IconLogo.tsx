import { SVGProps } from "./icon";

export default function IconLogo(props: SVGProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 115 50" {...props}>
            <g
                fill="none"
                stroke={props.color || "#333"}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={5}
            >
                <path d="M2.5 47.5v-45h20l5 10 5-10h20v45h-15v-30l-10 15-10-15v30h-15" />
                <path d="M52.5 17.5v30h30l-15-30h-15M52.5 2.5v15h30v-15h-30M82.5 2.5v45h30v-45h-15v30-30h-15" />
            </g>
        </svg>
    );
}

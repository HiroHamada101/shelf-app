import { StyleSheet, Text, View } from "react-native";
import { ICON_EMOJI } from "../constants/categories";
import Svg, {
  Circle,
  Ellipse,
  G,
  Path,
  Polygon,
  Rect,
  Text as SvgText,
} from "react-native-svg";

function Milk({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="10" y="14" width="20" height="22" rx="3" fill="#E3F2FD" />
      <Rect x="10" y="14" width="20" height="8" fill="#1E88E5" />
      <Rect x="14" y="4" width="12" height="10" rx="2" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="1" />
      <SvgText
        x="20"
        y="20"
        textAnchor="middle"
        fontSize="6"
        fontWeight="700"
        fill="#fff"
      >
        MILK
      </SvgText>
    </Svg>
  );
}

function Bread({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Ellipse cx="20" cy="16" rx="14" ry="8" fill="#FFCC80" />
      <Rect x="6" y="16" width="28" height="16" rx="3" fill="#FFB74D" />
      <Ellipse cx="14" cy="16" rx="3" ry="1.5" fill="#FFA726" opacity={0.5} />
    </Svg>
  );
}

function Egg({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Ellipse cx="20" cy="22" rx="10" ry="13" fill="#FFF3E0" />
      <Ellipse cx="20" cy="22" rx="10" ry="13" fill="none" stroke="#FFCC80" strokeWidth="1" />
      <Ellipse cx="18" cy="19" rx="3" ry="4" fill="#fff" opacity={0.6} />
    </Svg>
  );
}

function Chicken({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Ellipse cx="20" cy="22" rx="11" ry="10" fill="#FFCCBC" />
      <Circle cx="18" cy="18" r="7" fill="#FF8A65" />
      <Rect x="18" y="28" width="4" height="8" rx="2" fill="#FFAB91" />
    </Svg>
  );
}

function Cheese({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Polygon points="6,32 34,32 34,16 20,8" fill="#FFE082" />
      <Polygon points="6,32 34,32 34,16 20,8" fill="none" stroke="#FFC107" strokeWidth="1" />
      <Circle cx="18" cy="24" r="2.5" fill="#FFF8E1" />
      <Circle cx="26" cy="20" r="2" fill="#FFF8E1" />
    </Svg>
  );
}

function Veggie({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="8" y="12" width="24" height="20" rx="10" fill="#A5D6A7" />
      <Rect x="18" y="4" width="4" height="10" rx="2" fill="#66BB6A" />
    </Svg>
  );
}

function Carrot({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Path d="M20 36L12 14h16L20 36z" fill="#FF7043" />
      <Ellipse cx="20" cy="14" rx="8" ry="3" fill="#FF8A65" />
      <Path
        d="M17 14c-2-6 0-8 3-10"
        stroke="#66BB6A"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M23 14c2-5 1-8-2-10"
        stroke="#66BB6A"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function Banana({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Path
        d="M10 28c4-16 14-20 22-16"
        stroke="#FFC107"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

function Jar({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="10" y="14" width="20" height="20" rx="4" fill="#FFAB91" />
      <Rect x="12" y="8" width="16" height="6" rx="2" fill="#D7CCC8" />
    </Svg>
  );
}

function Fish({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Ellipse cx="18" cy="20" rx="12" ry="8" fill="#80DEEA" />
      <Polygon points="30,20 38,12 38,28" fill="#4DD0E1" />
      <Circle cx="13" cy="18" r="2" fill="#fff" />
      <Circle cx="13" cy="18" r="1" fill="#263238" />
    </Svg>
  );
}

function Tomato({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Circle cx="20" cy="22" r="12" fill="#EF5350" />
      <Path
        d="M16 10c2 2 6 2 8 0"
        stroke="#66BB6A"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function Butter({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="6" y="16" width="28" height="16" rx="3" fill="#FFF9C4" />
      <Rect x="6" y="16" width="28" height="6" rx="3" fill="#FFD54F" />
    </Svg>
  );
}

function Meat({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Ellipse cx="20" cy="22" rx="13" ry="10" fill="#FFCDD2" />
      <Ellipse cx="18" cy="20" rx="6" ry="5" fill="#EF9A9A" />
      <Circle cx="24" cy="18" r="3" fill="#E57373" />
    </Svg>
  );
}

function Avocado({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Ellipse cx="20" cy="22" rx="11" ry="14" fill="#8BC34A" />
      <Ellipse cx="20" cy="24" rx="7" ry="8" fill="#C5E1A5" />
      <Circle cx="20" cy="26" r="5" fill="#795548" />
    </Svg>
  );
}

function Rice({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="8" y="12" width="24" height="22" rx="3" fill="#F5F5F5" stroke="#E0E0E0" strokeWidth="1" />
      <Rect x="8" y="12" width="24" height="8" rx="3" fill="#FF7043" />
      <SvgText
        x="20"
        y="19"
        textAnchor="middle"
        fontSize="5.5"
        fontWeight="700"
        fill="#fff"
      >
        RICE
      </SvgText>
    </Svg>
  );
}

function Pill({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="8" y="14" width="24" height="12" rx="6" fill="#E8EAF6" />
      <Rect x="8" y="14" width="12" height="12" rx="6" fill="#5C6BC0" />
    </Svg>
  );
}

function Syrup({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="12" y="14" width="16" height="20" rx="3" fill="#CE93D8" />
      <Rect x="14" y="8" width="12" height="6" rx="2" fill="#BA68C8" />
    </Svg>
  );
}

function Drops({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="14" y="10" width="12" height="24" rx="4" fill="#B3E5FC" />
      <Rect x="14" y="10" width="12" height="8" rx="4" fill="#4FC3F7" />
    </Svg>
  );
}

function Bandaids({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <G transform="rotate(-30 20 20)">
        <Rect x="4" y="14" width="32" height="12" rx="6" fill="#FFCDD2" />
      </G>
      <G transform="rotate(30 20 20)">
        <Rect x="4" y="14" width="32" height="12" rx="6" fill="#FFCDD2" />
      </G>
      <Circle cx="20" cy="20" r="2" fill="#E57373" />
    </Svg>
  );
}

function Tube({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="12" y="16" width="16" height="18" rx="3" fill="#F8BBD0" />
      <Rect x="16" y="10" width="8" height="6" rx="2" fill="#F48FB1" />
    </Svg>
  );
}

function Cream({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Circle cx="20" cy="24" r="12" fill="#F3E5F5" />
      <Ellipse cx="20" cy="18" rx="10" ry="4" fill="#CE93D8" />
    </Svg>
  );
}

function Soap({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="8" y="16" width="24" height="16" rx="6" fill="#B2EBF2" />
      <Rect x="8" y="16" width="24" height="6" rx="6" fill="#80DEEA" />
      <Circle cx="28" cy="12" r="3" fill="#E0F7FA" />
    </Svg>
  );
}

function Bottle({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="14" y="14" width="12" height="20" rx="4" fill="#BBDEFB" />
      <Rect x="16" y="8" width="8" height="6" rx="2" fill="#90CAF9" />
      <Rect x="16" y="14" width="8" height="4" fill="#64B5F6" />
    </Svg>
  );
}

function Battery({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="10" y="12" width="20" height="24" rx="3" fill="#546E7A" />
      <Rect x="16" y="8" width="8" height="4" rx="1" fill="#78909C" />
      <Rect x="12" y="12" width="16" height="10" rx="1" fill="#78909C" />
      <SvgText x="20" y="20" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff">
        +
      </SvgText>
    </Svg>
  );
}

function Extinguisher({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="14" y="14" width="12" height="22" rx="4" fill="#EF5350" />
      <Rect x="16" y="8" width="8" height="6" rx="2" fill="#E57373" />
    </Svg>
  );
}

function Sponge({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="6" y="14" width="28" height="18" rx="6" fill="#FFE082" />
      <Rect x="6" y="14" width="28" height="6" rx="6" fill="#4DB6AC" />
    </Svg>
  );
}

function Bone({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="10" y="17" width="20" height="6" rx="3" fill="#D7CCC8" />
      <Circle cx="10" cy="17" r="4" fill="#BCAAA4" />
      <Circle cx="10" cy="23" r="4" fill="#BCAAA4" />
      <Circle cx="30" cy="17" r="4" fill="#BCAAA4" />
      <Circle cx="30" cy="23" r="4" fill="#BCAAA4" />
    </Svg>
  );
}

function Paw({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Ellipse cx="20" cy="26" rx="8" ry="6" fill="#A1887F" />
      <Circle cx="12" cy="18" r="4" fill="#8D6E63" />
      <Circle cx="20" cy="14" r="4" fill="#8D6E63" />
      <Circle cx="28" cy="18" r="4" fill="#8D6E63" />
    </Svg>
  );
}

function Water({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="14" y="10" width="12" height="24" rx="3" fill="#B3E5FC" />
      <Rect x="14" y="10" width="12" height="10" rx="3" fill="#29B6F6" />
      <Rect x="16" y="6" width="8" height="6" rx="2" fill="#81D4FA" />
    </Svg>
  );
}

function Juice({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="10" y="12" width="20" height="22" rx="2" fill="#FFCC80" />
      <Polygon points="10,12 30,12 28,8 12,8" fill="#FFB74D" />
      <Rect x="10" y="12" width="20" height="8" fill="#FF9800" />
    </Svg>
  );
}

function Yogurt({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Ellipse cx="20" cy="14" rx="12" ry="4" fill="#ECEFF1" />
      <Rect x="8" y="14" width="24" height="18" rx="4" fill="#F5F5F5" stroke="#CFD8DC" strokeWidth="1" />
      <Rect x="8" y="14" width="24" height="6" rx="4" fill="#FFFDE7" />
    </Svg>
  );
}

function Apple({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Path
        d="M20 10c-4 0-8 4-8 12 0 8 4 14 8 14s8-6 8-14c0-8-4-12-8-12z"
        fill="#E53935"
      />
      <Path d="M20 10v-4" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
      <Path d="M22 8c2-2 5-2 6 0" stroke="#66BB6A" strokeWidth="2" fill="none" />
    </Svg>
  );
}

function Noodles({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Path d="M8 26c24 0 24-4 24-8" stroke="#FFCA28" strokeWidth="3" fill="none" />
      <Path d="M10 28c20 0 20-3 20-6" stroke="#FFD54F" strokeWidth="2.5" fill="none" />
      <Path d="M12 30c16 0 16-2 16-4" stroke="#FFE082" strokeWidth="2" fill="none" />
      <Ellipse cx="20" cy="28" rx="12" ry="5" fill="#EF5350" />
    </Svg>
  );
}

function Coffee({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Path d="M10 14h16v14a4 4 0 01-4 4H14a4 4 0 01-4-4V14z" fill="#6D4C41" />
      <Path d="M26 18h4a3 3 0 010 6h-4" stroke="#8D6E63" strokeWidth="2" fill="none" />
      <Path d="M14 10c2-4 10-4 12 0" stroke="#BCAAA4" strokeWidth="1.5" fill="none" />
    </Svg>
  );
}

function Tea({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Path d="M8 16h18v12a5 5 0 01-5 5H13a5 5 0 01-5-5V16z" fill="#C8E6C9" />
      <Path d="M8 16h18v6H8z" fill="#81C784" />
      <Path d="M26 20h6a2 2 0 010 4h-6" stroke="#66BB6A" strokeWidth="1.5" fill="none" />
    </Svg>
  );
}

function Can({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Ellipse cx="20" cy="14" rx="9" ry="3" fill="#B0BEC5" />
      <Rect x="11" y="14" width="18" height="18" fill="#CFD8DC" />
      <Ellipse cx="20" cy="32" rx="9" ry="3" fill="#90A4AE" />
      <Rect x="13" y="18" width="14" height="4" rx="1" fill="#E53935" />
    </Svg>
  );
}

function Capsule({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="10" y="16" width="10" height="10" rx="5" fill="#5C6BC0" />
      <Rect x="20" y="16" width="10" height="10" rx="5" fill="#FF7043" />
    </Svg>
  );
}

function Inhaler({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="10" y="18" width="20" height="10" rx="2" fill="#90CAF9" />
      <Rect x="22" y="12" width="8" height="8" rx="1" fill="#42A5F5" />
      <Rect x="6" y="20" width="8" height="6" rx="2" fill="#64B5F6" />
    </Svg>
  );
}

function Thermometer({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="18" y="8" width="4" height="22" rx="2" fill="#ECEFF1" />
      <Circle cx="20" cy="32" r="6" fill="#EF5350" />
      <Rect x="19" y="12" width="2" height="12" fill="#EF5350" />
    </Svg>
  );
}

function Ointment({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="8" y="18" width="24" height="12" rx="6" fill="#FFF8E1" />
      <Rect x="8" y="18" width="24" height="5" rx="6" fill="#FFD54F" />
      <Rect x="28" y="14" width="6" height="8" rx="2" fill="#FFB300" />
    </Svg>
  );
}

function Shampoo({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="14" y="16" width="12" height="18" rx="3" fill="#E1BEE7" />
      <Rect x="16" y="10" width="8" height="8" rx="2" fill="#AB47BC" />
      <Rect x="17" y="6" width="6" height="6" rx="1" fill="#7B1FA2" />
    </Svg>
  );
}

function Lipstick({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="16" y="20" width="8" height="14" rx="1" fill="#FFD54F" />
      <Rect x="15" y="10" width="10" height="12" rx="2" fill="#424242" />
      <Path d="M16 10h8l-1-4H17z" fill="#E91E63" />
    </Svg>
  );
}

function Lotion({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="12" y="14" width="16" height="20" rx="4" fill="#E3F2FD" />
      <Ellipse cx="20" cy="14" rx="8" ry="3" fill="#64B5F6" />
      <Rect x="17" y="8" width="6" height="8" rx="2" fill="#42A5F5" />
    </Svg>
  );
}

function Diaper({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Path
        d="M6 22c0-6 6-10 14-10s14 4 14 10v8H6v-8z"
        fill="#FAFAFA"
        stroke="#E0E0E0"
        strokeWidth="1"
      />
      <Path d="M12 22h16" stroke="#90CAF9" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function Wipes({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="8" y="12" width="24" height="20" rx="3" fill="#E8F5E9" />
      <Rect x="8" y="12" width="24" height="8" rx="3" fill="#A5D6A7" />
      <Ellipse cx="20" cy="26" rx="6" ry="3" fill="#C8E6C9" />
    </Svg>
  );
}

function Spray({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="14" y="16" width="12" height="18" rx="3" fill="#E8EAF6" />
      <Rect x="12" y="10" width="16" height="8" rx="2" fill="#5C6BC0" />
      <Rect x="18" y="6" width="4" height="6" rx="1" fill="#3949AB" />
    </Svg>
  );
}

function Detergent({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Path d="M12 30V14l4-6h8l4 6v16H12z" fill="#81D4FA" />
      <Rect x="14" y="8" width="12" height="6" rx="2" fill="#29B6F6" />
      <Rect x="14" y="18" width="12" height="6" rx="1" fill="#fff" opacity={0.5} />
    </Svg>
  );
}

function Bulb({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Path
        d="M20 6c-6 0-10 5-10 11 0 4 2 7 4 9v4h12v-4c2-2 4-5 4-9 0-6-4-11-10-11z"
        fill="#FFF9C4"
        stroke="#FDD835"
        strokeWidth="1"
      />
      <Rect x="14" y="30" width="12" height="4" rx="1" fill="#9E9E9E" />
    </Svg>
  );
}

function Tissue({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="8" y="14" width="24" height="18" rx="2" fill="#ECEFF1" />
      <Ellipse cx="20" cy="18" rx="6" ry="3" fill="#B0BEC5" />
      <Rect x="10" y="22" width="20" height="2" fill="#CFD8DC" />
    </Svg>
  );
}

function Petbowl({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Path d="M8 18h24v4c0 6-5 10-12 10S8 28 8 22v-4z" fill="#A1887F" />
      <Ellipse cx="20" cy="18" rx="12" ry="4" fill="#8D6E63" />
    </Svg>
  );
}

function Kibble({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="10" y="12" width="20" height="22" rx="3" fill="#D7CCC8" />
      <Rect x="10" y="12" width="20" height="8" rx="3" fill="#8D6E63" />
      <Circle cx="14" cy="24" r="2" fill="#5D4037" />
      <Circle cx="20" cy="26" r="2" fill="#5D4037" />
      <Circle cx="26" cy="24" r="2" fill="#5D4037" />
    </Svg>
  );
}

function Toyball({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Circle cx="20" cy="20" r="12" fill="#FF7043" />
      <Path
        d="M10 20h20M20 10c-4 6-4 14 0 20M20 10c4 6 4 14 0 20"
        stroke="#fff"
        strokeWidth="2"
        opacity={0.5}
      />
    </Svg>
  );
}

function Package({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Polygon points="8,16 20,8 32,16 32,32 8,32" fill="#D7CCC8" />
      <Polygon points="8,16 20,24 32,16 20,8" fill="#BCAAA4" />
      <Path d="M20 8v24" stroke="#8D6E63" strokeWidth="1" />
    </Svg>
  );
}

function Takeaway({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Path d="M10 18h20l-2 14H12L10 18z" fill="#FFF8E1" />
      <Path d="M8 18h24l-2-4H10L8 18z" fill="#FFCC80" />
      <Path d="M14 10h12l2 4H12l2-4z" fill="#FFB74D" />
    </Svg>
  );
}

function Cup({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Path d="M12 12h12l2 18H10L12 12z" fill="#E3F2FD" />
      <Rect x="10" y="10" width="16" height="4" rx="2" fill="#90CAF9" />
      <Path d="M26 16h4a3 3 0 010 8h-4" stroke="#64B5F6" strokeWidth="1.5" fill="none" />
    </Svg>
  );
}

function Box({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="8" y="14" width="24" height="18" rx="2" fill="#D7CCC8" />
      <Rect x="8" y="14" width="24" height="6" rx="2" fill="#A1887F" />
      <Path d="M8 20h24" stroke="#8D6E63" strokeWidth="1" />
    </Svg>
  );
}

function Bag({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Path
        d="M12 16h16l2 16H10L12 16z"
        fill="#BCAAA4"
        stroke="#8D6E63"
        strokeWidth="1"
      />
      <Path
        d="M14 16c0-4 2.5-6 6-6s6 2 6 6"
        stroke="#6D4C41"
        strokeWidth="2"
        fill="none"
      />
    </Svg>
  );
}

function Citrus({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Circle cx="20" cy="22" r="11" fill="#FFA726" />
      <Path d="M20 10v4" stroke="#33691E" strokeWidth="2" strokeLinecap="round" />
      <Path d="M18 12h4" stroke="#558B2F" strokeWidth="2" strokeLinecap="round" />
      <Circle cx="14" cy="20" r="2" fill="#FFE0B2" opacity={0.6} />
    </Svg>
  );
}

function Grapes({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Circle cx="14" cy="22" r="5" fill="#7E57C2" />
      <Circle cx="20" cy="18" r="5" fill="#9575CD" />
      <Circle cx="26" cy="22" r="5" fill="#7E57C2" />
      <Circle cx="17" cy="26" r="4.5" fill="#5E35B1" />
      <Circle cx="23" cy="26" r="4.5" fill="#5E35B1" />
      <Path d="M20 12v4" stroke="#33691E" strokeWidth="2" />
    </Svg>
  );
}

function Mango({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Path
        d="M14 28c-2-10 2-18 10-20 6 8 4 18-2 22-4 2-8 0-8-2z"
        fill="#FFCA28"
      />
      <Path d="M22 10c2-2 6-2 6 2" stroke="#558B2F" strokeWidth="2" fill="none" />
    </Svg>
  );
}

function Potato({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Ellipse cx="20" cy="22" rx="12" ry="9" fill="#BCAAA4" />
      <Ellipse cx="16" cy="20" rx="2" ry="1.5" fill="#8D6E63" opacity={0.4} />
      <Ellipse cx="24" cy="24" rx="2" ry="1.5" fill="#8D6E63" opacity={0.35} />
    </Svg>
  );
}

function Corn({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Ellipse cx="20" cy="22" rx="8" ry="14" fill="#FFEE58" />
      <Path
        d="M14 14h12M14 18h12M14 22h12M14 26h12"
        stroke="#F9A825"
        strokeWidth="1.5"
      />
      <Path d="M20 8v6" stroke="#66BB6A" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}

function MushroomIco({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Ellipse cx="20" cy="16" rx="12" ry="8" fill="#EF9A9A" />
      <Circle cx="14" cy="14" r="2" fill="#FFCDD2" />
      <Circle cx="24" cy="13" r="2.5" fill="#FFCDD2" />
      <Rect x="17" y="20" width="6" height="14" rx="2" fill="#D7CCC8" />
    </Svg>
  );
}

function Pizza({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Path d="M20 8L34 34H6L20 8z" fill="#FFE082" />
      <Circle cx="22" cy="26" r="3" fill="#E53935" />
      <Circle cx="16" cy="28" r="2.5" fill="#43A047" />
      <Circle cx="24" cy="30" r="2" fill="#6D4C41" />
    </Svg>
  );
}

function SandwichIco({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="8" y="12" width="24" height="5" rx="1" fill="#FFE0B2" />
      <Rect x="8" y="17" width="24" height="4" fill="#FF7043" />
      <Rect x="8" y="21" width="24" height="3" fill="#FFF59D" />
      <Rect x="8" y="24" width="24" height="5" rx="1" fill="#FFE0B2" />
    </Svg>
  );
}

function Icecream({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Path d="M14 22L20 34L26 22Z" fill="#FFCC80" />
      <Circle cx="18" cy="14" r="6" fill="#F48FB1" />
      <Circle cx="24" cy="15" r="5" fill="#CE93D8" />
      <Circle cx="20" cy="10" r="5" fill="#FFF9C4" />
    </Svg>
  );
}

function Chocolate({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="10" y="14" width="20" height="14" rx="2" fill="#5D4037" />
      <Path d="M10 18h20M10 22h20M17 14v14M23 14v14" stroke="#3E2723" strokeWidth="1" />
    </Svg>
  );
}

function Cereal({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="10" y="14" width="20" height="18" rx="2" fill="#FFF8E1" />
      <Rect x="10" y="14" width="20" height="7" rx="2" fill="#FF7043" />
      <SvgText x="20" y="19" textAnchor="middle" fontSize="6" fontWeight="700" fill="#fff">
        OAT
      </SvgText>
    </Svg>
  );
}

function Soda({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Path d="M14 10h12l2 22H12L14 10z" fill="#E3F2FD" />
      <Rect x="13" y="8" width="14" height="4" rx="1" fill="#B0BEC5" />
      <Circle cx="17" cy="22" r="2" fill="#81D4FA" opacity={0.7} />
      <Circle cx="23" cy="26" r="2.5" fill="#81D4FA" opacity={0.5} />
    </Svg>
  );
}

function Oil({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="15" y="12" width="10" height="22" rx="2" fill="#FFFDE7" />
      <Rect x="13" y="8" width="14" height="6" rx="2" fill="#FDD835" />
      <Path d="M17 18h6v10H17z" fill="#FFEE58" opacity={0.7} />
    </Svg>
  );
}

function Spice({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="14" y="10" width="12" height="22" rx="2" fill="#EFEBE9" />
      <Circle cx="20" cy="8" r="5" fill="#A1887F" />
      <Circle cx="17" cy="22" r="1.5" fill="#6D4C41" />
      <Circle cx="23" cy="24" r="1.5" fill="#6D4C41" />
      <Circle cx="20" cy="27" r="1.5" fill="#6D4C41" />
    </Svg>
  );
}

function GarlicIco({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Path
        d="M16 32c-2-8 0-16 4-20 4 4 6 12 4 20h-8z"
        fill="#ECEFF1"
      />
      <Ellipse cx="20" cy="14" rx="6" ry="4" fill="#CFD8DC" />
    </Svg>
  );
}

function Shrimp({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Path
        d="M8 22c8-8 18-8 26 2-4 6-14 8-22 4-6-3-6-4-4-6z"
        fill="#FFAB91"
      />
      <Path d="M28 18l6-4M28 22l6 2" stroke="#FF7043" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function Blister({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="8" y="14" width="24" height="14" rx="2" fill="#ECEFF1" />
      <Circle cx="14" cy="21" r="4" fill="#9FA8DA" />
      <Circle cx="20" cy="21" r="4" fill="#9FA8DA" />
      <Circle cx="26" cy="21" r="4" fill="#9FA8DA" />
    </Svg>
  );
}

function Vial({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="16" y="16" width="8" height="18" rx="1" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="1" />
      <Rect x="14" y="12" width="12" height="6" rx="2" fill="#64B5F6" />
      <Rect x="17" y="22" width="6" height="8" fill="#42A5F6" opacity={0.5} />
    </Svg>
  );
}

function Deodorant({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="14" y="12" width="12" height="22" rx="4" fill="#ECEFF1" />
      <Ellipse cx="20" cy="12" rx="8" ry="3" fill="#78909C" />
      <Rect x="16" y="8" width="8" height="6" rx="2" fill="#B0BEC5" />
    </Svg>
  );
}

function Razor({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="8" y="16" width="24" height="10" rx="3" fill="#B0BEC5" />
      <Rect x="10" y="18" width="20" height="3" fill="#78909C" />
      <Rect x="14" y="10" width="12" height="8" rx="2" fill="#607D8B" />
    </Svg>
  );
}

function Perfume({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="14" y="18" width="12" height="16" rx="2" fill="#FCE4EC" />
      <Rect x="12" y="14" width="16" height="6" rx="2" fill="#F48FB1" />
      <Circle cx="20" cy="10" r="3" fill="#EC407A" />
    </Svg>
  );
}

function Rattle({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Circle cx="20" cy="18" r="10" fill="#90CAF9" />
      <Circle cx="17" cy="16" r="2" fill="#fff" />
      <Circle cx="23" cy="16" r="2" fill="#fff" />
      <Path d="M20 28v6" stroke="#64B5F6" strokeWidth="3" strokeLinecap="round" />
      <Rect x="14" y="32" width="12" height="4" rx="2" fill="#42A5F5" />
    </Svg>
  );
}

function Blocks({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="8" y="20" width="10" height="10" rx="1" fill="#EF5350" />
      <Rect x="20" y="18" width="10" height="10" rx="1" fill="#42A5F5" />
      <Rect x="14" y="10" width="10" height="10" rx="1" fill="#66BB6A" />
    </Svg>
  );
}

function Scissors({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Circle cx="14" cy="14" r="5" fill="none" stroke="#607D8B" strokeWidth="2" />
      <Circle cx="26" cy="14" r="5" fill="none" stroke="#607D8B" strokeWidth="2" />
      <Path d="M14 18l6 14M26 18l-6 14" stroke="#607D8B" strokeWidth="2" />
    </Svg>
  );
}

function Tape({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Circle cx="20" cy="20" r="12" fill="#FFD54F" stroke="#FFA000" strokeWidth="2" />
      <Circle cx="20" cy="20" r="6" fill="#FFF8E1" />
    </Svg>
  );
}

function Plug({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="14" y="10" width="12" height="14" rx="2" fill="#78909C" />
      <Rect x="10" y="14" width="4" height="6" rx="1" fill="#B0BEC5" />
      <Rect x="26" y="14" width="4" height="6" rx="1" fill="#B0BEC5" />
      <Path d="M18 24v8M22 24v8" stroke="#546E7A" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function Collar({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Path
        d="M8 22c4-8 20-8 24 0v6H8v-6z"
        fill="#EF5350"
        stroke="#C62828"
        strokeWidth="1"
      />
      <Circle cx="20" cy="22" r="3" fill="#FFD54F" />
    </Svg>
  );
}

function Seed({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Ellipse cx="20" cy="22" rx="10" ry="12" fill="#FFF8E1" />
      <Path d="M14 18h12M14 22h12M14 26h12" stroke="#FFCA28" strokeWidth="2" />
      <Circle cx="20" cy="14" r="3" fill="#8D6E63" />
    </Svg>
  );
}

function Gift({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="10" y="18" width="20" height="16" rx="2" fill="#E91E63" />
      <Rect x="10" y="18" width="20" height="6" rx="2" fill="#F48FB1" />
      <Rect x="18" y="12" width="4" height="22" fill="#F8BBD0" />
      <Path d="M14 12h12c0-4-6-6-6-6s-6 2-6 6z" fill="#F06292" />
    </Svg>
  );
}

function Clipboard({ s }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40">
      <Rect x="12" y="14" width="16" height="20" rx="2" fill="#FFFDE7" stroke="#FFB300" strokeWidth="2" />
      <Rect x="15" y="10" width="10" height="6" rx="2" fill="#FFB300" />
      <Path d="M16 20h8M16 24h8M16 28h5" stroke="#BCAAA4" strokeWidth="1.5" />
    </Svg>
  );
}

const RENDERERS = {
  milk: Milk,
  bread: Bread,
  egg: Egg,
  chicken: Chicken,
  cheese: Cheese,
  veggie: Veggie,
  carrot: Carrot,
  banana: Banana,
  jar: Jar,
  fish: Fish,
  tomato: Tomato,
  butter: Butter,
  meat: Meat,
  avocado: Avocado,
  rice: Rice,
  pill: Pill,
  syrup: Syrup,
  drops: Drops,
  bandaid: Bandaids,
  tube: Tube,
  cream: Cream,
  soap: Soap,
  bottle: Bottle,
  battery: Battery,
  extinguisher: Extinguisher,
  sponge: Sponge,
  bone: Bone,
  paw: Paw,
  water: Water,
  juice: Juice,
  yogurt: Yogurt,
  apple: Apple,
  noodles: Noodles,
  coffee: Coffee,
  tea: Tea,
  can: Can,
  capsule: Capsule,
  inhaler: Inhaler,
  thermometer: Thermometer,
  ointment: Ointment,
  shampoo: Shampoo,
  lipstick: Lipstick,
  lotion: Lotion,
  diaper: Diaper,
  wipes: Wipes,
  spray: Spray,
  detergent: Detergent,
  bulb: Bulb,
  tissue: Tissue,
  petbowl: Petbowl,
  kibble: Kibble,
  toyball: Toyball,
  package: Package,
  takeaway: Takeaway,
  cup: Cup,
  box: Box,
  bag: Bag,
  citrus: Citrus,
  grapes: Grapes,
  mango: Mango,
  potato: Potato,
  corn: Corn,
  mushroom: MushroomIco,
  pizza: Pizza,
  sandwich: SandwichIco,
  icecream: Icecream,
  chocolate: Chocolate,
  cereal: Cereal,
  soda: Soda,
  oil: Oil,
  spice: Spice,
  garlic: GarlicIco,
  shrimp: Shrimp,
  blister: Blister,
  vial: Vial,
  deodorant: Deodorant,
  razor: Razor,
  perfume: Perfume,
  rattle: Rattle,
  blocks: Blocks,
  scissors: Scissors,
  tape: Tape,
  plug: Plug,
  collar: Collar,
  seed: Seed,
  gift: Gift,
  clipboard: Clipboard,
};

function Placeholder({ size }) {
  return <View style={[styles.ph, { width: size, height: size }]} />;
}

const styles = StyleSheet.create({
  wrap: {
    flexShrink: 0,
  },
  emojiWrap: {
    justifyContent: "center",
    alignItems: "center",
  },
  emojiText: {
    textAlign: "center",
  },
  ph: {
    borderRadius: 8,
    backgroundColor: "#eee",
    flexShrink: 0,
  },
});

/**
 * Flat SVG product icons — PROTOTYPE_REFERENCE.jsx `ICONS` / `PI`
 * @param {object} props
 * @param {string} [props.icon] icon key
 * @param {string} [props.k] prototype alias for icon key
 * @param {number} [props.size]
 */
export default function ProductIcon({ icon, k, size = 32 }) {
  const key = icon ?? k ?? "milk";
  const emojiChar = ICON_EMOJI[key];
  if (emojiChar) {
    return (
      <View
        style={[styles.wrap, styles.emojiWrap, { width: size, height: size }]}
      >
        <Text style={[styles.emojiText, { fontSize: size * 0.58 }]}>{emojiChar}</Text>
      </View>
    );
  }
  const Cmp = RENDERERS[key];
  if (!Cmp) {
    return <Placeholder size={size} />;
  }
  return (
    <View style={styles.wrap}>
      <Cmp s={size} />
    </View>
  );
}

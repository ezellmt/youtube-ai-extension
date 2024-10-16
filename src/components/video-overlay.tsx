import React from 'react';
import { themes, type ThemeName } from '../styles/overlay-themes';
import triangleAlertIcon from "data-base64:/assets/triangle-alert.svg"
import infoIcon from "data-base64:/assets/info.svg"
import thumbsUpIcon from "data-base64:/assets/thumbs-up.svg"
import gaugeIcon from "data-base64:/assets/gauge.svg"
import flagIcon from "data-base64:/assets/flag.svg"

interface VideoOverlayProps {
  isVisible: boolean;
  theme: ThemeName;
}

const VideoOverlay: React.FC<VideoOverlayProps> = ({ isVisible, theme = 'dark' }) => {
  if (!isVisible) return null;

  const currentTheme = themes[theme];

  const iconMap = {
    'Result': triangleAlertIcon,
    'Rated': infoIcon,
    'Allowed': thumbsUpIcon,
    'Confidence': gaugeIcon,
    'Report': flagIcon
  };

  const headerItems = [
    { title: 'Result', value: 'Blocked', icon: 'Result', color: '#FFFFFF' },
    { title: 'Rated', value: '17+', icon: 'Rated', color: '#FFFFFF' },
    { title: 'Allowed', value: '4+', icon: 'Allowed', color: '#FFFFFF' },
    { title: 'Confidence', value: 'High', icon: 'Confidence', color: '#FFFFFF' },
    { title: 'Report', value: 'Result', icon: 'Report', color: '#FFFFFF' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box',
        overflow: 'auto',
      }}
    >
      <h1 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center', color: '#FFFFFF' }}>YouTube Parental Control</h1>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        {headerItems.map((item, index) => (
          <div key={index} style={{ 
            backgroundColor: '#333333',
            padding: '10px',
            borderRadius: '8px',
            textAlign: 'center',
            flex: 1,
            margin: '0 5px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: '#FFFFFF'
          }}>
            <img src={iconMap[item.icon]} alt={item.title} style={{ width: '24px', height: '24px', marginBottom: '5px' }} />
            <div style={{ fontSize: '14px', color: '#FFFFFF', marginBottom: '5px' }}>{item.title}</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px', color: '#FFFFFF' }}>Video Summary</h2>
        <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#FFFFFF' }}>
          The transcript captures a heated and humorous conversation between two individuals discussing unresolved issues in their relationship. The dialogue involves playful banter, insults, and some serious moments where one person expresses frustration at the other's dismissiveness. The conversation touches on themes of friendship, misunderstandings, and playful teasing about personal traits and feelings.
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px', color: '#FFFFFF' }}>Classification Rationale</h2>
        <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#FFFFFF' }}>
          The dialogue contains frequent use of strong language, sexual innuendos, and crude humor that may not be suitable for younger audiences. The conversation's content and tone suggest a maturity level that aligns more with older teens and adults.
        </p>
      </div>

      <div>
        <h2 style={{ fontSize: '20px', marginBottom: '10px', color: '#FFFFFF' }}>Flagged Words</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {['ass (4)', 'hate (4)', 'damn (4)', 'dumb (3)', 'suck (3)', 'dick (2)', 'goddamn (1)', 'die (1)'].map((word, index) => (
            <span key={index} style={{ 
              backgroundColor: '#2F94FF',
              padding: '5px 10px',
              borderRadius: '20px',
              fontSize: '14px',
              color: '#FFFFFF'
            }}>
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoOverlay;

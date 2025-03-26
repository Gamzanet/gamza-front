// Critical: DB0004, High: EA6336, Medium: EA9C36, Low: EAE436, Info: 36A2EA
export const getCardStyles = (severity: string, isDarkMode: boolean) => {
  const baseStyles = `text-xs border-2 box-border h-[64px] min-h-[64px] max-h-[70px] rounded-lg select-none transition duration-200`;

  const lightModeStyles = `bg-white text-black`;
  const darkModeStyles = `bg-black text-white`;

  const themeStyles = isDarkMode ? darkModeStyles : lightModeStyles;

  switch (severity) {
    case "Critical":
      return `${baseStyles} ${themeStyles} border-[#DB0004]`;
    case "High":
      return `${baseStyles} ${themeStyles} border-[#EA6336]`;
    case "Medium":
      return `${baseStyles} ${themeStyles} border-[#EA9C36]`;
    case "Low":
      return `${baseStyles} ${themeStyles} border-[#EAE436]`;
    case "Info":
      return `${baseStyles} ${themeStyles} border-[#36A2EA]`;
    default:
      return `${baseStyles} ${themeStyles} border-gray-500`;
  }
};

export const getSeverityLevel = (severity: string) => {
  switch (severity) {
    case "Critical":
      return 5;
    case "High":
      return 4;
    case "Medium":
      return 3;
    case "Low":
      return 2;
    case "Info":
      return 1;
    default:
      return 0; // 알 수 없는 심각도일 경우
  }
};

export const getBadgeStyles = (severity: string) => {
  const baseStyles = `text-[11px] border rounded-md select-none px-4 py-[4px] font-bold`;

  switch (severity) {
    case "Critical":
      return `${baseStyles} border-[#DB0004] text-[#DB0004] bg-[#DB0004]/10 hover:bg-[#DB0004]/10`;
    case "High":
      return `${baseStyles} border-[#EA6336] text-[#EA6336] bg-[#EA6336]/10 hover:bg-[#EA6336]/10`;
    case "Medium":
      return `${baseStyles} border-[#EA9C36] text-[#EA9C36] bg-[#EA9C36]/10 hover:bg-[#EA9C36]/10`;
    case "Low":
      return `${baseStyles} border-[#EAE436] text-[#EAE436] bg-[#EAE436]/10 hover:bg-[#EAE436]/10`;
    case "Info":
      return `${baseStyles} border-[#36A2EA] text-[#36A2EA] bg-[#36A2EA]/10 hover:bg-[#36A2EA]/10`;
    default:
      return `${baseStyles} border-gray-500 text-gray-500 bg-gray-500/10 hover:bg-gray-500/10`;
  }
};

import { cn } from "@/lib/utils";

export default function MovMonkey({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="139"
      height="141"
      viewBox="0 0 139 141"
      fill="none"
      className={cn("h-20 w-20 animate-ping", className)}
    >
      <path
        d="M49.7763 54.4961C46.2483 54.4961 43.4004 57.3364 43.4004 60.855C43.4004 64.3735 46.2483 67.2138 49.7763 67.2138C53.3044 67.2138 56.1523 64.3735 56.1523 60.855C56.1523 57.3364 53.3044 54.4961 49.7763 54.4961ZM47.7148 62.0208C46.0995 62.0208 44.7818 60.7066 44.7818 59.0957C44.7818 57.4848 46.0995 56.1706 47.7148 56.1706C49.33 56.1706 50.6477 57.4848 50.6477 59.0957C50.6477 60.7066 49.33 62.0208 47.7148 62.0208Z"
        fill="black"
      />
      <path
        d="M89.2217 54.4961C85.6936 54.4961 82.8457 57.3364 82.8457 60.855C82.8457 64.3735 85.6936 67.2138 89.2217 67.2138C92.7497 67.2138 95.5976 64.3735 95.5976 60.855C95.5976 57.3364 92.7497 54.4961 89.2217 54.4961ZM87.1601 62.0208C85.5449 62.0208 84.2272 60.7066 84.2272 59.0957C84.2272 57.4848 85.5449 56.1706 87.1601 56.1706C88.7753 56.1706 90.093 57.4848 90.093 59.0957C90.093 60.7066 88.7753 62.0208 87.1601 62.0208Z"
        fill="black"
      />
      <path
        d="M78.488 95.9345C78.488 90.9746 74.4711 83.7891 69.4979 83.7891C64.5247 83.7891 60.5078 90.9958 60.5078 95.9345C60.5078 100.894 64.5247 101.085 69.4979 101.085C74.4711 101.085 78.488 100.873 78.488 95.9345Z"
        fill="black"
      />
      <path
        d="M136.829 58.1625C132.472 45.6991 121.016 38.344 111.261 41.7354C109.582 42.3077 107.924 43.3251 106.585 44.4273C106.5 44.3214 106.437 44.2366 106.352 44.1306C104.566 41.8414 102.653 39.6794 100.634 37.7081C97.8715 34.9738 87.0961 26.5589 85.9272 25.5627C81.9316 22.0441 71.0925 13.2265 68.5634 0C66.3955 2.71312 65.2691 6.16811 65.2054 9.6231C65.1416 13.3112 66.0555 16.957 67.7345 20.2C64.8228 18.4831 59.7008 9.83506 58.6381 3.66695C54.9401 9.0296 56.0665 20.3696 57.6392 23.5278C53.3461 21.7474 49.8606 14.0531 49.7756 10.8737C47.6078 13.5868 45.0574 22.574 49.0317 29.3144C44.9086 31.7096 41.0618 34.783 37.5763 38.344C35.7485 40.2305 34.0057 42.2441 32.3692 44.3638C31.009 43.2404 29.4575 42.3501 27.7573 41.7566C18.0021 38.3652 6.56789 45.7203 2.18973 58.1837C-2.16717 70.6471 2.18973 83.5132 11.9449 86.9046C13.3264 87.3922 14.7291 87.6465 16.1531 87.7101C16.3018 84.8062 16.6631 81.8811 17.1945 78.9348C16.4294 78.8713 15.6642 78.7229 14.8991 78.4473C8.77822 76.3277 6.05781 68.2731 8.77822 60.4729C11.5199 52.6727 18.6822 48.0731 24.7819 50.1927C25.7595 50.5319 26.6521 51.0194 27.4385 51.6341C27.3747 51.7401 27.3322 51.8248 27.2685 51.9308C22.2952 60.3457 18.8097 69.8417 17.1732 79.2952C16.6631 82.2415 16.3231 85.1877 16.1956 88.0704C16.1318 89.2574 16.1106 90.4444 16.1106 91.6314C16.3018 122.324 39.149 140.574 69.9236 140.383C100.698 140.192 123.29 121.645 123.078 90.9531C123.078 89.8933 123.035 88.8123 122.971 87.7313C124.374 87.6677 125.756 87.3922 127.116 86.9258C136.829 83.492 141.207 70.6259 136.829 58.1625ZM69.8386 133.579C47.289 133.727 28.905 119.844 28.7987 102.569C28.7349 93.4543 33.7932 85.2089 41.8694 79.4436C38.9365 76.7516 36.5986 73.0847 35.3234 68.7606C32.1142 57.7174 37.1087 46.5682 46.4813 43.855C55.854 41.1419 66.0555 45.4872 69.2647 56.5304C69.286 56.6152 69.3072 56.7212 69.3497 56.8272C69.371 56.7424 69.3922 56.6364 69.4135 56.5304C72.4952 45.4448 82.6117 40.9724 92.0056 43.5583C101.421 46.1442 106.543 57.2299 103.482 68.3155C102.271 72.6608 99.9968 76.3489 97.0851 79.0832C105.246 84.7426 110.411 92.9244 110.475 102.039C110.581 119.314 92.3882 133.43 69.8386 133.579ZM124.119 78.4473C123.375 78.7017 122.631 78.8501 121.866 78.9348C121.845 78.8289 121.824 78.7229 121.803 78.5957C120.06 69.3117 116.511 59.9642 111.537 51.6977C112.324 51.1042 113.301 50.5107 114.215 50.1927C120.315 48.0731 127.477 52.6727 130.219 60.4729C132.96 68.2519 130.219 76.3065 124.119 78.4473Z"
        fill="black"
      />
      <path
        d="M92.5165 101.086C93.6429 102.654 94.2805 104.35 94.2805 106.131C94.2805 113.973 82.2512 120.311 67.4165 120.311C58.2989 120.311 50.2439 117.916 45.377 114.228C49.2238 119.569 59.0215 123.363 70.4769 123.363C85.3117 123.363 97.3409 117.004 97.3409 109.183C97.3409 106.173 95.5557 103.375 92.5165 101.086Z"
        fill="black"
      />
      <path
        d="M99.8475 78.9144C93.2803 78.9144 86.8193 77.9182 82.1649 76.1801C75.3214 73.6365 71.3258 66.6842 71.4958 57.5698C70.6669 57.379 70.0506 57.273 69.4555 57.273C68.8816 57.273 68.244 57.379 67.5427 57.5274C67.6915 66.6842 63.6959 73.6365 56.8311 76.1801C52.1554 77.9182 45.7157 78.9144 39.1485 78.9144C33.6014 78.9144 28.4369 78.1937 24.6325 76.9008C16.8751 74.2724 14.8136 61.3851 13.6021 53.6697L13.4109 52.4615C13.3259 51.8892 13.1983 51.7832 12.2632 51.2533C11.3281 50.7234 9.92534 49.9179 9.24524 48.0951C8.33136 45.6363 7.90629 39.0866 12.1782 37.4969C12.9433 37.2214 14.4098 36.8398 18.3416 36.8398C24.6113 36.8398 33.2613 37.7513 33.6226 37.7937C42.6552 38.5991 53.1755 41.4394 59.4027 44.7672L59.764 44.8308C62.9733 45.4455 66.225 45.7635 69.4342 45.7635C72.6434 45.7635 75.8952 45.4455 79.1044 44.8308C79.2744 44.7884 79.4445 44.7672 79.5932 44.746C85.8417 41.4394 96.3407 38.5991 105.331 37.7937C105.692 37.7513 114.342 36.8398 120.612 36.8398C124.544 36.8398 126.01 37.2214 126.775 37.4969C131.047 39.0866 130.622 45.6363 129.708 48.0951C129.049 49.9179 127.625 50.7234 126.69 51.2533C125.776 51.7832 125.649 51.8892 125.543 52.4615L125.351 53.6697C124.119 61.3639 122.078 74.2512 114.321 76.9008C110.538 78.2149 105.395 78.9144 99.8475 78.9144ZM105.416 47.9043C96.6595 47.9043 86.8618 49.8543 82.6112 52.4615C80.9534 53.4789 79.8058 55.005 79.7208 56.3616C79.2107 63.8651 80.9322 68.1891 85.0128 69.5881C89.0296 70.9658 95.108 71.8349 100.889 71.8349C105.225 71.8349 109.05 71.3473 111.643 70.4783C114.385 69.5457 116.361 64.0134 116.361 57.3366C116.361 52.5887 113.726 49.3668 112.387 48.7733C110.474 47.9043 108.009 47.9043 105.416 47.9043ZM33.5801 47.9043C30.9872 47.9043 28.5219 47.9043 26.6091 48.7521C25.2701 49.3456 22.6347 52.5675 22.6347 57.3154C22.6347 64.0134 24.6113 69.5245 27.3529 70.4571C29.9458 71.3261 33.7501 71.8137 38.107 71.8137C43.8879 71.8137 49.9663 70.9446 53.9832 69.5669C58.0638 68.1679 59.8065 63.8227 59.2752 56.3404C59.1902 55.005 58.0425 53.4789 56.3848 52.4403C52.1554 49.8543 42.3577 47.9043 33.5801 47.9043Z"
        fill="#FAFAFA"
      />
      <path
        d="M125.946 39.8495C122.333 38.493 105.649 40.2947 105.649 40.2947C96.0642 41.1425 85.8626 44.1948 80.4856 47.1411C80.2518 47.1835 79.9543 47.247 79.6142 47.3106C72.877 48.6248 66.076 48.6248 59.3174 47.3106C59.0412 47.247 58.7861 47.2046 58.5736 47.1623C53.2178 44.216 42.9738 41.1425 33.3673 40.2947C33.3673 40.2947 16.6836 38.493 13.0706 39.8495C10.6902 40.7398 10.9665 45.5513 11.5828 47.2682C12.3905 49.4726 15.3234 48.9215 15.8547 52.0798C16.8961 58.4811 18.7026 72.2798 25.4399 74.569C29.1592 75.8196 34.0899 76.4555 39.1694 76.4555C45.2053 76.4555 51.4113 75.5864 56.0019 73.8907C63.3768 71.1564 65.1621 63.4198 65.0558 57.6332C65.0345 56.4038 65.9059 55.344 67.1174 55.1109C67.9037 54.9625 68.6901 54.8141 69.4977 54.8141C70.3266 54.8141 71.1342 54.9625 71.9418 55.1109C73.1533 55.344 74.0246 56.4038 74.0034 57.6332C73.8971 63.4198 75.6824 71.1352 83.0572 73.8695C87.6267 75.5652 93.8538 76.4343 99.8897 76.4343C104.969 76.4343 109.9 75.8196 113.619 74.5478C120.357 72.2586 122.163 58.4599 123.204 52.0586C123.715 48.9003 126.647 49.4514 127.476 47.247C128.05 45.5513 128.305 40.7398 125.946 39.8495ZM54.7905 71.8983C47.2456 74.5054 33.7286 75.2049 26.5663 72.7885C22.4219 71.3896 20.1691 64.8187 20.1691 57.2941C20.1691 51.783 23.2296 47.5226 25.6312 46.4628C28.0328 45.403 30.7957 45.403 33.6011 45.403C42.3999 45.403 52.7715 47.2894 57.7022 50.3205C60.0613 51.7618 61.634 54.0086 61.7616 56.1495C61.9953 59.668 62.4417 69.2699 54.7905 71.8983ZM112.429 72.7885C105.267 75.2261 91.7498 74.5054 84.2049 71.8983C76.5538 69.2488 77.0001 59.6468 77.2339 56.1495C77.3826 54.0086 78.9341 51.7618 81.2932 50.3205C86.2239 47.2894 96.5955 45.403 105.394 45.403C108.221 45.403 110.984 45.403 113.364 46.4628C115.766 47.5226 118.826 51.783 118.826 57.2941C118.848 64.8187 116.595 71.3896 112.429 72.7885Z"
        fill="#3DB945"
      />
    </svg>
  );
}

import { AnalysisResult } from "~~/types/gamza/AnalysisResult";

const ExpectResponse: { data: AnalysisResult } = {
  data: {
    hookGasConsumption: {
      swap: 1,
      addLiquidity: 2,
      removeLiquidity: 3,
      donate: 4,
    },
    tokenPriceDifference: {
      expect: 1,
      actual: 2,
    },
    testLogs: [
      {
        type: "warning",
        title: "test_addLiquidity_secondAdditionSameRange",
        pass: false,
        summary: "Fail to add liquidity twice within same range",
        description: "description",
        trace: `fatal: 'origin/main' does not appear to be a git repository
fatal: 리모트 저장소에서 읽을 수 없습니다

올바른 접근 권한이 있는지, 그리고 저장소가 있는지
확인하십시오.
❯ git push origin main --forc
error: ambiguous option: forc (could be --force-with-lease or --force-if-includes)
사용법: git push [<옵션>] [<저장소> [<레퍼런스명세>...]]

    -v, --[no-]verbose    더 자세히 표시합니다
    -q, --[no-]quiet      더 간략히 표시합니다
    --[no-]repo <저장소>  저장소
    --[no-]all            push all branches
    --[no-]branches       alias of --all
    --[no-]mirror         모든 레퍼런스 미러
    -d, --[no-]delete     레퍼런스 삭제
    --[no-]tags           push tags (can't be used with --all or --branches or --mirror)
    -n, --[no-]dry-run    가짜로 실행
    --[no-]porcelain      컴퓨터가 읽을 수 있는 형식
    -f, --[no-]force      강제로 업데이트
    --[no-]force-with-lease[=<refname>:<expect>]
                          레퍼런스의 과거 값이 이 값이어야 합니다
    --[no-]force-if-includes
                          require remote updates to be integrated locally
    --[no-]recurse-submodules (check|on-demand|no)
                          재귀적 하위 모듈 푸시 방식을 설정합니다
    --[no-]thin           얇은 묶음을 사용합니다
    --[no-]receive-pack <receive-pack>
                          receive pack 프로그램
    --[no-]exec <receive-pack>
                          receive pack 프로그램
    -u, --[no-]set-upstream
                          git pull/status에 대한 업스트림을 설정합니다
    --[no-]progress       강제로 진행 상황을 표시합니다
    --[no-]prune          로컬에서 제거한 레퍼런스를 잘라냅니다
    --no-verify           푸시 전 후크를 건너뜁니다
    --verify              opposite of --no-verify
    --[no-]follow-tags    빠졌지만 관련된 태그를 푸시합니다
    --[no-]signed[=(yes|no|if-asked)]
                          푸시에 GPG 서명
    --[no-]atomic         리모트 쪽에 원자 트랜잭션을 요청합니다
    -o, --[no-]push-option <서버-전용-옵션>
                          전송할 옵션
    -4, --ipv4            IPv4 주소만 사용합니다
    -6, --ipv6            IPv6 주소만 사용합니다`,
      },
      {
        type: "warning",
        title: "test_addLiquidity_secondAdditionSameRange",
        pass: false,
        summary: "Fail to add liquidity twice within same range",
        description: "description",
        trace: `fatal: 'origin/main' does not appear to be a git repository
fatal: 리모트 저장소에서 읽을 수 없습니다

올바른 접근 권한이 있는지, 그리고 저장소가 있는지
확인하십시오.
❯ git push origin main --forc
error: ambiguous option: forc (could be --force-with-lease or --force-if-includes)
사용법: git push [<옵션>] [<저장소> [<레퍼런스명세>...]]

    -v, --[no-]verbose    더 자세히 표시합니다
    -q, --[no-]quiet      더 간략히 표시합니다
    --[no-]repo <저장소>  저장소
    --[no-]all            push all branches
    --[no-]branches       alias of --all
    --[no-]mirror         모든 레퍼런스 미러
    -d, --[no-]delete     레퍼런스 삭제
    --[no-]tags           push tags (can't be used with --all or --branches or --mirror)
    -n, --[no-]dry-run    가짜로 실행
    --[no-]porcelain      컴퓨터가 읽을 수 있는 형식
    -f, --[no-]force      강제로 업데이트
    --[no-]force-with-lease[=<refname>:<expect>]
                          레퍼런스의 과거 값이 이 값이어야 합니다
    --[no-]force-if-includes
                          require remote updates to be integrated locally
    --[no-]recurse-submodules (check|on-demand|no)
                          재귀적 하위 모듈 푸시 방식을 설정합니다
    --[no-]thin           얇은 묶음을 사용합니다
    --[no-]receive-pack <receive-pack>
                          receive pack 프로그램
    --[no-]exec <receive-pack>
                          receive pack 프로그램
    -u, --[no-]set-upstream
                          git pull/status에 대한 업스트림을 설정합니다
    --[no-]progress       강제로 진행 상황을 표시합니다
    --[no-]prune          로컬에서 제거한 레퍼런스를 잘라냅니다
    --no-verify           푸시 전 후크를 건너뜁니다
    --verify              opposite of --no-verify
    --[no-]follow-tags    빠졌지만 관련된 태그를 푸시합니다
    --[no-]signed[=(yes|no|if-asked)]
                          푸시에 GPG 서명
    --[no-]atomic         리모트 쪽에 원자 트랜잭션을 요청합니다
    -o, --[no-]push-option <서버-전용-옵션>
                          전송할 옵션
    -4, --ipv4            IPv4 주소만 사용합니다
    -6, --ipv6            IPv6 주소만 사용합니다`,
      },
      {
        type: "warning",
        title: "test_addLiquidity_secondAdditionSameRange",
        pass: false,
        summary: "Fail to add liquidity twice within same range",
        description: "description",
        trace: `fatal: 'origin/main' does not appear to be a git repository
fatal: 리모트 저장소에서 읽을 수 없습니다

올바른 접근 권한이 있는지, 그리고 저장소가 있는지
확인하십시오.
❯ git push origin main --forc
error: ambiguous option: forc (could be --force-with-lease or --force-if-includes)
사용법: git push [<옵션>] [<저장소> [<레퍼런스명세>...]]

    -v, --[no-]verbose    더 자세히 표시합니다
    -q, --[no-]quiet      더 간략히 표시합니다
    --[no-]repo <저장소>  저장소
    --[no-]all            push all branches
    --[no-]branches       alias of --all
    --[no-]mirror         모든 레퍼런스 미러
    -d, --[no-]delete     레퍼런스 삭제
    --[no-]tags           push tags (can't be used with --all or --branches or --mirror)
    -n, --[no-]dry-run    가짜로 실행
    --[no-]porcelain      컴퓨터가 읽을 수 있는 형식
    -f, --[no-]force      강제로 업데이트
    --[no-]force-with-lease[=<refname>:<expect>]
                          레퍼런스의 과거 값이 이 값이어야 합니다
    --[no-]force-if-includes
                          require remote updates to be integrated locally
    --[no-]recurse-submodules (check|on-demand|no)
                          재귀적 하위 모듈 푸시 방식을 설정합니다
    --[no-]thin           얇은 묶음을 사용합니다
    --[no-]receive-pack <receive-pack>
                          receive pack 프로그램
    --[no-]exec <receive-pack>
                          receive pack 프로그램
    -u, --[no-]set-upstream
                          git pull/status에 대한 업스트림을 설정합니다
    --[no-]progress       강제로 진행 상황을 표시합니다
    --[no-]prune          로컬에서 제거한 레퍼런스를 잘라냅니다
    --no-verify           푸시 전 후크를 건너뜁니다
    --verify              opposite of --no-verify
    --[no-]follow-tags    빠졌지만 관련된 태그를 푸시합니다
    --[no-]signed[=(yes|no|if-asked)]
                          푸시에 GPG 서명
    --[no-]atomic         리모트 쪽에 원자 트랜잭션을 요청합니다
    -o, --[no-]push-option <서버-전용-옵션>
                          전송할 옵션
    -4, --ipv4            IPv4 주소만 사용합니다
    -6, --ipv6            IPv6 주소만 사용합니다`,
      },
      {
        type: "warning",
        title: "test_addLiquidity_secondAdditionSameRange",
        pass: false,
        summary: "Fail to add liquidity twice within same range",
        description: "description",
        trace: `fatal: 'origin/main' does not appear to be a git repository
fatal: 리모트 저장소에서 읽을 수 없습니다

올바른 접근 권한이 있는지, 그리고 저장소가 있는지
확인하십시오.
❯ git push origin main --forc
error: ambiguous option: forc (could be --force-with-lease or --force-if-includes)
사용법: git push [<옵션>] [<저장소> [<레퍼런스명세>...]]

    -v, --[no-]verbose    더 자세히 표시합니다
    -q, --[no-]quiet      더 간략히 표시합니다
    --[no-]repo <저장소>  저장소
    --[no-]all            push all branches
    --[no-]branches       alias of --all
    --[no-]mirror         모든 레퍼런스 미러
    -d, --[no-]delete     레퍼런스 삭제
    --[no-]tags           push tags (can't be used with --all or --branches or --mirror)
    -n, --[no-]dry-run    가짜로 실행
    --[no-]porcelain      컴퓨터가 읽을 수 있는 형식
    -f, --[no-]force      강제로 업데이트
    --[no-]force-with-lease[=<refname>:<expect>]
                          레퍼런스의 과거 값이 이 값이어야 합니다
    --[no-]force-if-includes
                          require remote updates to be integrated locally
    --[no-]recurse-submodules (check|on-demand|no)
                          재귀적 하위 모듈 푸시 방식을 설정합니다
    --[no-]thin           얇은 묶음을 사용합니다
    --[no-]receive-pack <receive-pack>
                          receive pack 프로그램
    --[no-]exec <receive-pack>
                          receive pack 프로그램
    -u, --[no-]set-upstream
                          git pull/status에 대한 업스트림을 설정합니다
    --[no-]progress       강제로 진행 상황을 표시합니다
    --[no-]prune          로컬에서 제거한 레퍼런스를 잘라냅니다
    --no-verify           푸시 전 후크를 건너뜁니다
    --verify              opposite of --no-verify
    --[no-]follow-tags    빠졌지만 관련된 태그를 푸시합니다
    --[no-]signed[=(yes|no|if-asked)]
                          푸시에 GPG 서명
    --[no-]atomic         리모트 쪽에 원자 트랜잭션을 요청합니다
    -o, --[no-]push-option <서버-전용-옵션>
                          전송할 옵션
    -4, --ipv4            IPv4 주소만 사용합니다
    -6, --ipv6            IPv6 주소만 사용합니다`,
      },
      {
        type: "warning",
        title: "test_addLiquidity_secondAdditionSameRange",
        pass: false,
        summary: "Fail to add liquidity twice within same range",
        description: "description",
        trace: `fatal: 'origin/main' does not appear to be a git repository
fatal: 리모트 저장소에서 읽을 수 없습니다

올바른 접근 권한이 있는지, 그리고 저장소가 있는지
확인하십시오.
❯ git push origin main --forc
error: ambiguous option: forc (could be --force-with-lease or --force-if-includes)
사용법: git push [<옵션>] [<저장소> [<레퍼런스명세>...]]

    -v, --[no-]verbose    더 자세히 표시합니다
    -q, --[no-]quiet      더 간략히 표시합니다
    --[no-]repo <저장소>  저장소
    --[no-]all            push all branches
    --[no-]branches       alias of --all
    --[no-]mirror         모든 레퍼런스 미러
    -d, --[no-]delete     레퍼런스 삭제
    --[no-]tags           push tags (can't be used with --all or --branches or --mirror)
    -n, --[no-]dry-run    가짜로 실행
    --[no-]porcelain      컴퓨터가 읽을 수 있는 형식
    -f, --[no-]force      강제로 업데이트
    --[no-]force-with-lease[=<refname>:<expect>]
                          레퍼런스의 과거 값이 이 값이어야 합니다
    --[no-]force-if-includes
                          require remote updates to be integrated locally
    --[no-]recurse-submodules (check|on-demand|no)
                          재귀적 하위 모듈 푸시 방식을 설정합니다
    --[no-]thin           얇은 묶음을 사용합니다
    --[no-]receive-pack <receive-pack>
                          receive pack 프로그램
    --[no-]exec <receive-pack>
                          receive pack 프로그램
    -u, --[no-]set-upstream
                          git pull/status에 대한 업스트림을 설정합니다
    --[no-]progress       강제로 진행 상황을 표시합니다
    --[no-]prune          로컬에서 제거한 레퍼런스를 잘라냅니다
    --no-verify           푸시 전 후크를 건너뜁니다
    --verify              opposite of --no-verify
    --[no-]follow-tags    빠졌지만 관련된 태그를 푸시합니다
    --[no-]signed[=(yes|no|if-asked)]
                          푸시에 GPG 서명
    --[no-]atomic         리모트 쪽에 원자 트랜잭션을 요청합니다
    -o, --[no-]push-option <서버-전용-옵션>
                          전송할 옵션
    -4, --ipv4            IPv4 주소만 사용합니다
    -6, --ipv6            IPv6 주소만 사용합니다`,
      },
    ],
  },
};

export default ExpectResponse;

/**
 * 한글 마지막 글자의 받침 유무에 따라 조사를 골라 붙여요.
 * 예: josa('민수님', '과', '와') === '민수님과', josa('친구', '과', '와') === '친구와'
 * 한글이 아닌 글자로 끝나면 받침이 없는 쪽(withoutBatchim)을 붙여요.
 */
export function josa(word: string, withBatchim: string, withoutBatchim: string): string {
  const code = word.charCodeAt(word.length - 1)
  const isHangulSyllable = code >= 0xac00 && code <= 0xd7a3
  const hasBatchim = isHangulSyllable && (code - 0xac00) % 28 !== 0
  return word + (hasBatchim ? withBatchim : withoutBatchim)
}

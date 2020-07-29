
export function parseCommitMessage(message: string){
    return message.split("\n\n", 1)
}

export function parseCommitTitle(message: string){
  const re = /Release ((\d+[.]?){1,2}\d)/u
  const matched = re.exec(message)
  if (matched){
    return {
      is_release: true, version: matched[1]
    }
  }
  return {isRelease:false, version:""}
}

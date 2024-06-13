
TOKEN_FILE=~/.kube/TOKEN

if ! test -f "$TOKEN_FILE" || test $(( `date +%s` - `stat -L --format %Y $TOKEN_FILE` )) -gt 240; then
  umask 177
  oci ce cluster generate-token --cluster-id "$5" --region "$7" >$TOKEN_FILE
fi

cat $TOKEN_FILE
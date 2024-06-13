if ! (return 0 2>/dev/null); then
  echo "ERROR: Usage: 'source state-functions.sh"
  exit
fi

if test -z "$MTDRWORKSHOP_STATE_HOME"; then
  echo "ERROR: The mtdrworkshopt state home folder was not set"
else
  mkdir -p $MTDRWORKSHOP_STATE_HOME/state
fi

function state_done() {
  test -f $MTDRWORKSHOP_STATE_HOME/state/"$1"
}

function state_set_done() {
  touch $MTDRWORKSHOP_STATE_HOME/state/"$1"
  echo "`date`: $1" >>$MTDRWORKSHOP_LOG/state.log
  echo "$1 completed"
}

function state_set() {
  echo "$2" > $MTDRWORKSHOP_STATE_HOME/state/"$1"
  echo "`date`: $1: $2" >>$MTDRWORKSHOP_LOG/state.log
  echo "$1: $2"
}


function state_reset() {
  rm -f $MTDRWORKSHOP_STATE_HOME/state/"$1"
}


function state_get() {
    if ! state_done "$1"; then
        return 1
    fi
    cat $MTDRWORKSHOP_STATE_HOME/state/"$1"
}


export -f state_done
export -f state_set_done
export -f state_set
export -f state_reset
export -f state_get

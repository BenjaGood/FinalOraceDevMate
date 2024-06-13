
if ! (return 0 2>/dev/null); then
  echo "ERROR: Usage 'source setup.sh'"
  exit
fi

if state_done SETUP; then
  echo "The setup has been completed"
  return
fi

SETUP_SCRIPT="$MTDRWORKSHOP_LOCATION/utils/main-setup.sh"
if ps -ef | grep "$SETUP_SCRIPT" | grep -v grep; then
  echo "The $SETUP_SCRIPT is already running.  If you want to restart it then kill it and then rerun."
else
  $SETUP_SCRIPT 2>&1 | tee -ai $MTDRWORKSHOP_LOG/main-setup.log
fi
set -e

echo "Deleting Object Store"

PARIDS=`oci os preauth-request list --bucket-name "$(state_get RUN_NAME)-$(state_get MTDR_KEY)" --query "join(' ',data[*].id)" --raw-output`
for id in $PARIDS; do
    oci os preauth-request delete --par-id "$id" --bucket-name "$(state_get RUN_NAME)-$(state_get MTDR_KEY)" --force
done

if state_done WALLET_ZIP_OBJECT; then
  oci os object delete --object-name "wallet.zip" --bucket-name "$(state_get RUN_NAME)-$(state_get MTDR_KEY)" --force
  state_reset WALLET_ZIP_OBJECT
fi


if state_done CWALLET_SSO_OBJECT; then
  oci os object delete --object-name "cwallet.sso" --bucket-name "$(state_get RUN_NAME)-$(state_get MTDR_KEY)" --force
  state_reset CWALLET_SSO_OBJECT
fi
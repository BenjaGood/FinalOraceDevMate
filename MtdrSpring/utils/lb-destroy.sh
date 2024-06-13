
set -e

echo "Deleting Load Balancers"
LBIDS=`oci lb load-balancer list --compartment-id "$(state_get COMPARTMENT_OCID)" --query "join(' ',data[*].id)" --raw-output`
for lb in $LBIDS; do
  oci lb load-balancer delete --load-balancer-id "$lb" --force
done
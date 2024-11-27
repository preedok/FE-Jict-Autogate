#!/bin/bash

docker_path="/home/ocr/Deploy/OCR/JoingateOCRMonitoring"
docker_compose="docker-compose.production.yml"
repo_path="/home/ocr/Deploy/OCR/JoingateOCRMonitoring"
log_directory="/home/ocr/Deploy/OCR/logs"
image_name="joingateocrmonitoring:prod"
local_registry="joingateocr:5000"  # Replace with your local Docker registry address
seq_server="localhost"
seq_port="5341"

# Create a log file with the current date in the specified log directory
log_file="$log_directory/logfile_$(date '+%Y-%m-%d').log"

# Redirect both echo messages and seq output to the log file
{
    # Get the creation timestamp of the current local image (if available)
    current_image_timestamp=$(sudo docker images --format "{{.CreatedAt}}" jocr-docker-registry:5000/joingateocrapi:latest 2>/dev/null | head -n 1)
    echo "current image creation timestamp: $current_image_timestamp"

    # Fetch information about the latest image from your local registry
    latest_image_info=$(curl -s "http://$local_registry/v2/$image_name/manifests/latest")

    # Check if jq is available and parse image creation timestamp
    if command -v jq &> /dev/null; then
        latest_image_timestamp=$(echo "$latest_image_info" | jq -r '.history[0].v1Compatibility' | jq -r '.created')
    else
        # Fallback to awk if jq is not available
        latest_image_timestamp=$(echo "$latest_image_info" | awk '/created/ {print $2}' | tr -d ',"')
    fi

    echo "latest image creation timestamp: $latest_image_timestamp"

    if [ -z "$latest_image_timestamp" ]; then
        echo "Failed to fetch the latest image creation timestamp from the local registry."
        exit 1
    fi

    # Convert both timestamps to a common format (including timezone)
    given_datetime=$current_image_timestamp

    # Modify the input string to replace WIB with the timezone offset
    modified_datetime=$(echo "$given_datetime" | sed 's/ WIB//')

    # Convert to UTC using date
    utc_datetime=$(date -u -d "$modified_datetime" "+%Y-%m-%d %H:%M:%S UTC")

    echo "$utc_datetime"

    # Convert both timestamps to a common format (including timezone)
    current_timestamp_formatted=$(date -u -d "$utc_datetime" "+%Y-%m-%dT%H:%M%z" 2>/dev/null)
    latest_timestamp_formatted=$(date -u -d "$latest_image_timestamp" "+%Y-%m-%dT%H:%M%z" 2>/dev/null)
    echo "$current_timestamp_formatted"
    echo "$latest_timestamp_formatted"

    # Compare timestamps
    if [ "$current_timestamp_formatted" != "$latest_timestamp_formatted" ]; then
        echo "Local image is older than the latest local registry image."
        echo "Updating local image..."

        sudo docker pull "$local_registry/$image_name:latest" | tee -a "$log_file"

        if [ $? -ne 0 ]; then
            echo "Failed to pull the latest image. Exiting..." | tee -a "$log_file"
            exit 1
        fi

        # Stop and remove existing containers
        echo "Stopping and removing existing containers..." | tee -a "$log_file"
        cd "$repo_path" || exit
        sudo docker-compose -f "$docker_compose" down | tee -a "$log_file"

        # Start containers in detached mode
        echo "Starting containers in detached mode..." | tee -a "$log_file"
        sudo docker-compose -f "$docker_compose" up -d | tee -a "$log_file"

        if [ $? -ne 0 ]; then
            echo "Failed to start containers. Check the logs for more information." | tee -a "$log_file"
            exit 1
        fi
    else
        echo "Local image is up-to-date with the latest local registry image." | tee -a "$log_file"
    fi

    # Echo messages and seq output
    echo "$utc_datetime"
    echo "$current_timestamp_formatted"
    echo "$latest_timestamp_formatted"

    # Create a JSON object with your data
    json_data='{"utc_datetime": "'"$utc_datetime"'", "current_timestamp_formatted": "'"$current_timestamp_formatted"'", "latest_timestamp_formatted": "'"$latest_timestamp_formatted"'"}'

    # Send the JSON data to Seq using curl
    curl -X POST -H "Content-Type: application/json" -d "$json_data" "http://$seq_server:$seq_port" | tee -a "$log_file"
} 2>&1 | tee -a "$log_file"

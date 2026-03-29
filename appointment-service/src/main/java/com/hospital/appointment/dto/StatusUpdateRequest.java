package com.hospital.appointment.dto;

import lombok.Data;

@Data
public class StatusUpdateRequest {
    private String status;  // CONFIRMED, COMPLETED, CANCELLED, NO_SHOW
}
